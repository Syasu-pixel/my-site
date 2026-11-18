#!/usr/bin/env python3
"""Offline regression tests. All payloads below are invented at runtime."""
import contextlib
import importlib.util
import io
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('guard', Path(__file__).with_name('check-search-privacy.py'))
guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guard)


def invented(label='clicks', value=731):
    return label + ': ' + str(value)


class GuardTests(unittest.TestCase):
    def test_prose_labels_and_formats(self):
        for label in ('clicks', 'impressions', 'CTR', '平均順位', 'クリック数', '表示回数', '引用数'):
            self.assertTrue(guard.findings(invented(label)))
        self.assertTrue(guard.findings('Google: ' + str(731) + ' / ' + str(902)))
        self.assertTrue(guard.findings('７３１' + 'クリック'))
        self.assertTrue(guard.findings('clicks' + ': ' + '&#55;&#51;&#49;'))

    def test_json_and_csv_markdown_tsv(self):
        self.assertTrue(guard.findings(json.dumps(dict([("clicks", 731)]))))
        for delim in (',', '\t', '|'):
            body = delim.join(['query', 'clicks', 'impressions']) + '\n'
            body += delim.join(['invented-query', str(731), str(902)])
            self.assertTrue(guard.findings(body))

    def test_multiline_html_table(self):
        body = '<table><tr>\n<th>Query</th><th>Clicks</th></tr>\n<tr>\n<td>fiction</td><td>'
        body += str(731) + '</td>\n</tr></table>'
        self.assertTrue(guard.findings(body))

    def test_technical_values_and_qualitative_text(self):
        for body in ('DC24V 3A、500V、100MΩ、0.2秒、90日',
                     '端子1、2、3。LED表示3灯。クリックすると画像を拡大。',
                     'GoogleとBingで表示回数の傾向を確認。詳細は非公開資料。',
                     '公開日2026-11-18、HTTP200、ページ数289、QA成功30件',
                     'position: absolute; left: 12px; top: 30px;',
                     'Volume Range,Queries Range,Sites Range\n100-200,10-20,3-8'):
            self.assertFalse(guard.findings(body))

    def test_private_export_blocked_even_empty(self):
        self.assertTrue(guard.inspect_bytes(b'', 'site_AISearchQueriesReport_fake.csv'))

    def test_diagnostics_never_echo_payload_or_path(self):
        with tempfile.TemporaryDirectory() as root:
            path = Path(root) / 'secret-query-731.md'
            path.write_text(invented() + '\n', encoding='utf-8')
            out = io.StringIO()
            with contextlib.redirect_stdout(out):
                code = guard.main([str(path)])
            self.assertEqual(code, 1)
            self.assertNotIn('731', out.getvalue())
            self.assertNotIn('secret-query', out.getvalue())
            self.assertNotIn('clicks', out.getvalue())

    def test_missing_bad_encoding_symlink_fail_closed(self):
        with tempfile.TemporaryDirectory() as root:
            root = Path(root)
            bad = root / 'bad.md'
            bad.write_bytes(b'\xff\xfe\x00')
            link = root / 'link'
            link.symlink_to(bad)
            for path in (bad, link, root / 'missing'):
                with contextlib.redirect_stdout(io.StringIO()):
                    self.assertEqual(guard.main([str(path)]), 2)

    def test_hash_exceptions_cannot_hide_changed_fixture(self):
        root = Path(__file__).resolve().parents[1]
        path = root / 'scripts/test_search_backlog_report.py'
        self.assertFalse(guard.inspect_bytes(path.read_bytes(), str(path)))
        self.assertTrue(guard.inspect_bytes(path.read_bytes() + invented().encode(), str(path)))

    def test_each_commit_including_deleted_leak_and_staged_index(self):
        old = Path.cwd()
        with tempfile.TemporaryDirectory() as root:
            try:
                os.chdir(root)
                def git(*args):
                    return subprocess.check_output(['git', *args], stderr=subprocess.DEVNULL).decode().strip()
                git('init', '-q')
                git('config', 'user.email', 'fixture@example.invalid')
                git('config', 'user.name', 'Synthetic Test')
                Path('note.md').write_text('qualitative', encoding='utf-8')
                git('add', '.')
                git('commit', '-qm', 'initial')
                base = git('rev-parse', 'HEAD')
                Path('note.md').write_text(invented(), encoding='utf-8')
                git('add', '.')
                with contextlib.redirect_stdout(io.StringIO()):
                    self.assertEqual(guard.main(['--staged']), 1)
                git('commit', '-qm', 'synthetic leak')
                Path('note.md').write_text('removed', encoding='utf-8')
                git('add', '.')
                git('commit', '-qm', 'remove fixture')
                with contextlib.redirect_stdout(io.StringIO()):
                    self.assertEqual(guard.main(['--base', base]), 1)
                    self.assertEqual(guard.main(['note.md']), 0)
            finally:
                os.chdir(old)

    def test_artifact_tree_nested_and_no_output_values(self):
        with tempfile.TemporaryDirectory() as root:
            path = Path(root) / 'docs'
            path.mkdir()
            (path / 'memo.txt').write_text(invented('引用数'), encoding='utf-8')
            with contextlib.redirect_stdout(io.StringIO()):
                self.assertEqual(guard.main([root]), 1)


if __name__ == '__main__':
    unittest.main()
