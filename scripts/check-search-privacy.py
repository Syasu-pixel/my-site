#!/usr/bin/env python3
"""Offline search-metric guard. Diagnostics never contain input text or paths.

Same engine for pre-send files, every new Git commit, and publication trees.
This is a heuristic safety net, not an authorization or a complete DLP system.
"""
from __future__ import annotations
import argparse
import csv
import hashlib
import html
import itertools
import json
from pathlib import Path
import re
import subprocess
import sys
import unicodedata

METRIC = r'(?:clicks?|impressions?|ctr|average[_ ]position|avg[_ ]position|citation[_ ]share|citations|クリック(?:数)?|表示回数|インプレッション(?:数)?|平均(?:掲載)?順位|掲載順位|引用数|引用シェア)'
NUMBER = r'[+-]?\d+(?:[,，]\d{3})*(?:\.\d+)?(?:\s*[%％])?'
# A named metric directly associated with a number, not just any nearby number.
PAIR = re.compile(rf'(?<![\w]){METRIC}[\s\"\'`:：=]*{NUMBER}(?![\w])', re.I)
REVERSE = re.compile(rf'{NUMBER}\s*(?:回|件)?\s*{METRIC}(?![\w])', re.I)
HEADER = re.compile(rf'^(?:{METRIC}|position)$', re.I)
SOURCE = re.compile(r'\b(?:Google|Bing|GSC|Search Console)\b|検索実績|検索データ|自サイト', re.I)
SHORTHAND = re.compile(rf'\b(?:Google|Bing|GSC)\s*[:：]\s*{NUMBER}\s*[/／]\s*{NUMBER}', re.I)
TEXT_SUFFIXES = {'.md', '.mdx', '.txt', '.csv', '.tsv', '.json', '.jsonl', '.html', '.htm', '.xml', '.yaml', '.yml', '.js', '.mjs', '.cjs', '.ts', '.tsx', '.py', '.sql', '.toml', '.njk', '.css', '.sh'}
SKIP_DIRS = {'.git', 'node_modules', '__pycache__', '.venv'}
# Explicit byte-pinned market-only datasets, not a directory or filename bypass.
REVIEWED_SHA256 = {
    '94eb43aad867f574f1be5033355386ff25cf588d27ea7b39b10d7244993138e2',  # Reviewed zero-initialized client aggregates, no observed metrics.
    # Reviewed historical synthetic tests, algorithm thresholds, and policy ranges.
    'eb45460942fb06778f84f109d3a1eb795ab2bfee9c31ab8ae58ef52535e8a776',  # scripts/test_search_data_sync.py
    '31d0f07e021f1a5ec155057046f260005b74d3255011b0439282b4414295a38b',  # scripts/test_search_backlog_report.py
    '213a87c5dc38a4d0e4d333203da7e5b541d7b124de5c88650b2d21e7570051ce',  # scripts/search_backlog_report.py
    'ed9f9ff3145965501afc772bb2a6b1d80129375c86b6a3af5abef7e6273804d9',  # docs/search-data-acquisition-rules.md
    'd0d0620699ecd938a99062a120c968d8f3bc63e363d1b7169f3a493c978062ba',  # docs/denkicontrol-strategy-whitepaper.md

    '2cc4c97a263aee76902d185ddd7b083a58950f261f02896a17e8fd70150697b6',
    '2edc7d48a5201d38ce4108b496eca68a9c76b2d559d0be32d94737194d85ab6a',
}
MAX_BYTES = 16 * 1024 * 1024


class ScanError(Exception):
    pass


def normal(text):
    return unicodedata.normalize('NFKC', html.unescape(text))


def findings(text):
    """Return (line, constant rule ID), never matched values or source excerpts."""
    lines = normal(text).splitlines()
    hits = set()
    for i, line in enumerate(lines, 1):
        # Remove HTML tags while retaining text/cell separators and JSON values.
        plain = re.sub(r'<[^>]*>', ' ', line)
        if PAIR.search(plain) or REVERSE.search(plain):
            hits.add((i, 'metric-value'))
        if SHORTHAND.search(plain):
            hits.add((i, 'provider-count-pair'))
    # Structured CSV/TSV/Markdown columns: inspect only numeric metric cells.
    for delimiter in (',', '\t', '|'):
        columns = []
        for i, line in enumerate(lines, 1):
            try:
                cells = next(csv.reader([line.strip().strip('|')], delimiter=delimiter))
            except (csv.Error, StopIteration):
                columns = []
                continue
            cells = [re.sub(r'[*`]', '', x).strip() for x in cells]
            found = [j for j, x in enumerate(cells) if HEADER.fullmatch(x)]
            if found and len(cells) > 1:
                columns = found
            elif columns and len(cells) > max(columns):
                if any(re.fullmatch(NUMBER, cells[j]) for j in columns):
                    hits.add((i, 'metric-table-cell'))
            elif line.strip() and not re.fullmatch(r'[| :\-]+', line):
                columns = []
    # HTML tables split headers/cells over several source lines.
    columns = []
    for row in re.finditer(r'<tr\b[^>]*>(.*?)</tr\s*>', normal(text), re.I | re.S):
        cells = [re.sub(r'<[^>]*>', '', x).strip() for x in
                 re.findall(r'<t[hd]\b[^>]*>(.*?)</t[hd]\s*>', row.group(1), re.I | re.S)]
        found = [j for j, x in enumerate(cells) if HEADER.fullmatch(x)]
        if found:
            columns = found
        elif columns and len(cells) > max(columns):
            if any(re.fullmatch(NUMBER, cells[j]) for j in columns):
                hits.add((normal(text)[:row.start()].count('\n') + 1, 'metric-html-cell'))
    return sorted(hits)


def inspect_bytes(data, name):
    if hashlib.sha256(data).hexdigest() in REVIEWED_SHA256:
        return []
    # Private export is forbidden even when the file has no rows yet.
    if re.search(r'AISearchQueriesReport.*\.csv$', name, re.I):
        return [(1, 'private-export')]
    if len(data) > MAX_BYTES:
        raise ScanError('input-size')
    if b'\x00' in data:
        if Path(name).suffix.lower() in TEXT_SUFFIXES:
            raise ScanError('text-encoding')
        return []  # binary media is outside this textual guard
    try:
        text = data.decode('utf-8-sig')
    except UnicodeDecodeError:
        if Path(name).suffix.lower() in TEXT_SUFFIXES:
            raise ScanError('text-encoding')
        return []
    return findings(text)


def git(*args):
    proc = subprocess.run(['git', *args], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if proc.returncode:
        raise ScanError('git-operation')
    return proc.stdout


def file_id(name):
    # Paths can themselves contain query strings; never echo them into CI logs.
    return hashlib.sha256(name.encode('utf-8', errors='surrogateescape')).hexdigest()[:16]


def collect_files(paths):
    for name in paths:
        path = Path(name)
        if path.is_symlink():
            raise ScanError('symlink-input')
        if path.is_dir():
            for child in sorted(path.rglob('*')):
                if any(x in SKIP_DIRS for x in child.relative_to(path).parts):
                    continue
                if child.is_symlink():
                    raise ScanError('symlink-input')
                if child.is_file():
                    # Large binary images should not be loaded to inspect text.
                    if child.suffix.lower() not in TEXT_SUFFIXES and child.stat().st_size > MAX_BYTES:
                        continue
                    yield str(child), child.read_bytes()
        elif path.is_file():
            yield str(path), path.read_bytes()
        else:
            raise ScanError('missing-input')


def commit_inputs(base, head):
    # Resolve untrusted refs before use. No shell interpolation or API credentials.
    base = git('rev-parse', '--verify', base + '^{commit}').decode().strip()
    head = git('rev-parse', '--verify', head + '^{commit}').decode().strip()
    git('merge-base', '--is-ancestor', base, head)
    commits = git('rev-list', '--reverse', base + '..' + head).decode().splitlines()
    for commit in commits:
        # Compare every commit with each parent, including merge commits. Thus a
        # leak introduced and later deleted still fails before upload/PR merge.
        parents = git('rev-list', '--parents', '-n', '1', commit).decode().split()[1:]
        paths = set()
        for parent in parents:
            paths.update(git('diff', '--name-only', '--diff-filter=ACMRT', '-z', parent, commit).split(b'\0'))
        for raw in sorted(paths - {b''}):
            name = raw.decode('utf-8', errors='surrogateescape')
            yield commit + ':' + name, git('show', commit + ':' + name)
        yield commit + ':message', git('show', '-s', '--format=%B', commit)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('paths', nargs='*', help='pre-send files, PR text file, or final artifact directory')
    parser.add_argument('--base', help='exclusive commit ancestor (checks EVERY intervening commit)')
    parser.add_argument('--head', default='HEAD')
    parser.add_argument('--staged', action='store_true', help='inspect Git index bytes before commit/upload')
    args = parser.parse_args(argv)
    failures = []
    checked = 0
    try:
        inputs = collect_files(args.paths)
        if args.base:
            inputs = itertools.chain(inputs, commit_inputs(args.base, args.head))
        staged = []
        if args.staged:
            for raw in git('diff', '--cached', '--name-only', '--diff-filter=ACMRT', '-z').split(b'\0'):
                if raw:
                    name = raw.decode('utf-8', errors='surrogateescape')
                    staged.append((name, git('show', ':' + name)))
        if not (args.paths or args.base or args.staged):
            raise ScanError('no-input')
        for name, data in itertools.chain(inputs, staged):
            checked += 1
            for line, rule in inspect_bytes(data, name):
                failures.append({'file_id': file_id(name), 'line': line, 'rule': rule})
    except (ScanError, OSError) as error:
        # Never stringify exception: OS/Git errors may embed input or paths.
        print(json.dumps({'status': 'error', 'reason': str(error) if isinstance(error, ScanError) else 'input-read'}))
        return 2
    print(json.dumps({'status': 'fail' if failures else 'pass', 'checked': checked, 'findings': failures}))
    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(main())
