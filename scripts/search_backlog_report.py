#!/usr/bin/env python3
"""Create a review-only Google search candidate section in the existing backlog.

Reads Supabase's official-API data; never writes to Supabase. Public output
deliberately omits raw performance counts. Completion checkboxes remain manual.
"""
from __future__ import annotations
import argparse
from collections import defaultdict
from dataclasses import dataclass
from datetime import date, datetime, timedelta, timezone
import json
import os
from pathlib import Path
import re
from urllib.parse import urlencode, urlsplit
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BACKLOG_REL = "docs/existing-article-improvement-backlog.md"
START = "<!-- SEARCH_BACKLOG_AUTO_START -->"
END = "<!-- SEARCH_BACKLOG_AUTO_END -->"


class ReportError(RuntimeError):
    pass


@dataclass
class Metrics:
    clicks: int = 0
    impressions: int = 0
    position_total: float = 0.0

    def add(self, row):
        imp = int(row["impressions"])
        self.clicks += int(row["clicks"])
        self.impressions += imp
        if row.get("avg_position") is not None:
            self.position_total += float(row["avg_position"]) * imp

    @property
    def ctr(self):
        return self.clicks / self.impressions if self.impressions else 0.0

    @property
    def position(self):
        return self.position_total / self.impressions if self.impressions else None


def api_rows(table, **filters):
    endpoint = os.environ["SEARCH_DATA_SUPABASE_URL"].rstrip("/")
    token = os.environ["SEARCH_DATA_SUPABASE_SERVICE_ROLE_KEY"]
    if not endpoint.startswith("https://"):
        raise ReportError("Supabase endpoint must use HTTPS")
    rows = []
    offset = 0
    while True:
        query = urlencode({**filters, "limit": 1000, "offset": offset})
        req = Request(endpoint + "/rest/v1/" + table + "?" + query,
                      headers={"apikey": token, "Authorization": "Bearer " + token,
                               "Accept": "application/json"},
                      method="GET")
        try:
            with urlopen(req, timeout=30) as response:
                batch = json.load(response)
        except Exception as error:
            raise ReportError("Supabase read failed: " + type(error).__name__) from None
        if not isinstance(batch, list):
            raise ReportError("Unexpected Supabase response")
        rows.extend(batch)
        if len(batch) < 1000:
            return rows
        offset += len(batch)


def published_articles(sitemap):
    if not sitemap.is_file():
        raise ReportError("Missing sitemap; cannot verify published articles")
    urls = set()
    for item in ET.parse(sitemap).iter():
        if item.tag.rsplit("}", 1)[-1] != "loc" or not item.text:
            continue
        url = item.text.strip()
        parsed = urlsplit(url)
        if parsed.scheme == "https" and parsed.netloc == "denkicontrol.com" and re.fullmatch(
            r"/articles/[a-z0-9-]+\.html", parsed.path
        ):
            urls.add(url)
    if not urls:
        raise ReportError("No published Japanese articles in sitemap")
    return urls


def manual_states(text):
    return {slug: state == "x" for state, slug in re.findall(
        r"^- \[([ x])\] .articles/([a-z0-9-]+\.html).", text, flags=re.M
    )}


def content_date(path):
    if not path.is_file():
        return None
    body = path.read_text(encoding="utf-8")
    match = re.search(
        r"""class=["'][^"']*\barticle-updated\b[^"']*["'][\s\S]{0,450}?datetime=["'](\d{4}-\d{2}-\d{2})""",
        body, flags=re.I,
    )
    if match:
        return date.fromisoformat(match.group(1))
    # Visible Japanese content-update dates are also valid.
    # Do not confuse content changes with the official-source review date.
    ja = re.search(r"最終内容更新\s*[:：]\s*(\d{4})年(\d{1,2})月(\d{1,2})日", body)
    if ja:
        return date(int(ja.group(1)), int(ja.group(2)), int(ja.group(3)))
    return None


def classify(old, new):
    if new.impressions < 150:
        return None
    if old.impressions < 150:
        return ("データ不足", "前期間の露出が少なく変化判定不能", new.impressions)
    position_change = ((old.position or 0) - (new.position or 0))
    click_drop = (old.clicks - new.clicks) / max(1, old.clicks)
    ctr_drop = (old.ctr - new.ctr) * 100
    if old.clicks >= 20 and new.impressions >= 600 and (
        (click_drop >= 0.25 and (ctr_drop >= 0.4 or position_change <= -1.5))
        or (old.clicks >= 80 and click_drop >= 0.10 and ctr_drop >= 0.45
            and new.impressions >= 1500)
    ):
        return ("悪化・要確認", "クリック減とCTR/順位の変化を精査", old.clicks - new.clicks)
    if (new.position is not None and 4 <= new.position <= 15
        and new.impressions >= 1000
        and (new.ctr < 0.01 or (new.impressions >= 2000 and new.ctr < 0.015))):
        return ("改善余地", "露出に対するCTR・検索意図を確認",
                new.impressions * max(0.0, 0.02 - new.ctr))
    if ((old.clicks >= 10 and new.clicks - old.clicks >= 10
         and new.clicks >= old.clicks * 1.40)
        or (new.impressions >= 1000 and new.impressions >= old.impressions * 1.65
            and new.clicks >= old.clicks + 8)):
        return ("伸長・監視", "露出・クリックの増加が継続するか観察",
                new.clicks - old.clicks)
    return None


def render(rows, current, published, end_date, bing_date, root):
    recent_start = end_date - timedelta(days=27)
    previous_start = end_date - timedelta(days=55)
    previous_end = recent_start - timedelta(days=1)
    manual = manual_states(current)
    grouped = defaultdict(lambda: {"current": Metrics(), "previous": Metrics()})
    for row in rows:
        url = row.get("page") or ""
        if url not in published:
            continue
        day = date.fromisoformat(row["data_date"])
        if previous_start <= day <= end_date:
            grouped[url]["current" if day >= recent_start else "previous"].add(row)
    categories = defaultdict(list)
    for url, buckets in grouped.items():
        finding = classify(buckets["previous"], buckets["current"])
        if not finding:
            continue
        category, reason, score = finding
        slug = url.rsplit("/", 1)[-1]
        if slug not in manual:
            status = "バックログ未掲載・手動確認"
        else:
            status = "完成・凍結" if manual[slug] else "未完了"
        edited = content_date(root / "articles" / slug)
        if edited and 0 <= (end_date - edited).days < 28:
            status += "／28日クールダウン"
        elif edited is None:
            status += "／更新日・PR履歴要確認"
        categories[category].append((score, slug, reason, status))
    lines = [
        "## 検索実績の機械評価（確認用・自動生成）", "",
        "- Google直近28日：" + str(recent_start) + "〜" + str(end_date),
        "- Google前28日：" + str(previous_start) + "〜" + str(previous_end),
        "- データ源：Google公式API → Supabase（確定日次データ、ページ別）。",
        "- Bingのページ別データは週次スナップショットのため日次Googleと合算しない。"
        + (" 最終保存日：" + str(bing_date) if bing_date else " 直近スナップショット未確認。"),
        "- これは調査提案であり本文修正の指示ではない。内容更新日・GitHub/PR履歴・メーカー資料と照合する。",
        "- 公開GitHubに生のクリック数・表示回数・順位を掲載しない。チェックリストの完了状態は変更しない。",
    ]
    for category in ("悪化・要確認", "改善余地", "伸長・監視", "データ不足"):
        lines += ["", "### " + category + "（上位8件）", "",
                  "| 記事 | 検出理由 | 手動確認事項 |", "|---|---|---|"]
        items = sorted(categories[category], key=lambda row: (-row[0], row[1]))
        for _, slug, reason, status in items[:8]:
            lines.append("| articles/" + slug + " | " + reason + " | " + status + " |")
        if not items:
            lines.append("| なし | — | — |")
    lines += ["", "※ 候補抽出用の暫定閾値。検索語構成・季節性・祝日などの影響は別途確認する。"]
    return "\n".join(lines) + "\n"


def replace_generated(current, report):
    block = START + "\n" + report + END
    if START in current or END in current:
        if current.count(START) != 1 or current.count(END) != 1:
            raise ReportError("Invalid generated section markers")
        a, b = current.index(START), current.index(END)
        if a >= b:
            raise ReportError("Generated section markers are reversed")
        return current[:a] + block + current[b + len(END):]
    return current.rstrip() + "\n\n" + block + "\n"


def build(root=ROOT, today=None):
    today = today or datetime.now(timezone(timedelta(hours=9))).date()
    path = root / BACKLOG_REL
    current = path.read_text(encoding="utf-8")
    latest_rows = api_rows("search_performance_daily", select="data_date",
                           source="eq.google", grain="eq.site", is_final="eq.true",
                           order="data_date.desc")
    if not latest_rows:
        raise ReportError("Google site data not found")
    latest = date.fromisoformat(latest_rows[0]["data_date"])
    if not 2 <= (today - latest).days <= 7:
        raise ReportError("Google data not fresh enough: " + str(latest))
    start = latest - timedelta(days=55)
    dates = api_rows("search_performance_daily", select="data_date",
                     source="eq.google", grain="eq.site", is_final="eq.true",
                     data_date="gte." + str(start), order="data_date.asc")
    seen = {date.fromisoformat(item["data_date"]) for item in dates
            if date.fromisoformat(item["data_date"]) <= latest}
    if seen != {start + timedelta(days=i) for i in range(56)}:
        raise ReportError("Incomplete Google site day coverage")
    page_rows = api_rows("search_performance_daily",
                         select="page,data_date,clicks,impressions,avg_position",
                         source="eq.google", grain="eq.page", search_type="eq.web",
                         is_final="eq.true", data_date="gte." + str(start),
                         order="record_key.asc")
    bing_rows = api_rows("search_performance_daily", select="data_date",
                         source="eq.bing", grain="eq.page", order="data_date.desc")
    bing_date = date.fromisoformat(bing_rows[0]["data_date"]) if bing_rows else None
    if bing_date and (today - bing_date).days > 14:
        bing_date = None
    report = render(page_rows, current, published_articles(root / "sitemap.xml"),
                    latest, bing_date, root)
    return replace_generated(current, report)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--write", action="store_true")
    args = parser.parse_args()
    result = build()
    if args.write:
        (ROOT / BACKLOG_REL).write_text(result, encoding="utf-8")
        print("Backlog generated section updated")
    else:
        print(result)


if __name__ == "__main__":
    try:
        main()
    except (ReportError, ValueError, KeyError, OSError, ET.ParseError) as error:
        print("Search backlog generation refused: " + str(error), file=__import__("sys").stderr)
        raise SystemExit(1) from None
