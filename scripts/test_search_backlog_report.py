#!/usr/bin/env python3
"""Offline tests for review-only search backlog generation."""
import importlib.util
from datetime import date
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import sys

file = Path(__file__).with_name("search_backlog_report.py")
spec = importlib.util.spec_from_file_location("search_backlog_report", file)
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)


class SearchBacklogTests(unittest.TestCase):
    def test_growing_article_is_monitor_only(self):
        prev = module.Metrics(clicks=30, impressions=1000, position_total=9000)
        now = module.Metrics(clicks=90, impressions=2600, position_total=15600)
        self.assertEqual(module.classify(prev, now)[0], "伸長・監視")

    def test_decline_with_ctr_drop(self):
        prev = module.Metrics(clicks=350, impressions=10500, position_total=66000)
        now = module.Metrics(clicks=300, impressions=11600, position_total=67000)
        self.assertEqual(module.classify(prev, now)[0], "悪化・要確認")

    def test_low_ctr_is_candidate(self):
        prev = module.Metrics(clicks=5, impressions=1600, position_total=14500)
        now = module.Metrics(clicks=5, impressions=3700, position_total=31000)
        self.assertEqual(module.classify(prev, now)[0], "改善余地")

    def test_insufficient_baseline(self):
        self.assertEqual(module.classify(module.Metrics(impressions=0),
                                         module.Metrics(impressions=800))[0], "データ不足")

    def test_generated_section_is_idempotent_and_keeps_checkboxes(self):
        original = "# backlog\n\n- [x] articles/done.html\n\nother text\n"
        proposal = "## generated\n\nData only\n"
        first = module.replace_generated(original, proposal)
        self.assertEqual(first, module.replace_generated(first, proposal))
        self.assertIn("- [x] articles/done.html", first)
        self.assertEqual(first.count(module.START), 1)
        self.assertEqual(first.count(module.END), 1)

    def test_bad_marker_is_rejected(self):
        with self.assertRaises(module.ReportError):
            module.replace_generated("hello " + module.START, "text")

    def test_filters_unpublished_and_preserves_frozen(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            (root / "articles").mkdir()
            (root / "articles/test.html").write_text("no update date", encoding="utf-8")
            rows = [
                dict(page="https://denkicontrol.com/articles/test.html",
                     data_date="2026-10-01", clicks=10, impressions=300, avg_position=9),
                dict(page="https://denkicontrol.com/articles/test.html",
                     data_date="2026-10-29", clicks=80, impressions=1000, avg_position=6),
                dict(page="https://denkicontrol.com/articles/unpublished.html",
                     data_date="2026-10-29", clicks=500, impressions=5000, avg_position=1),
            ]
            original = "# Existing\n\n- [x] " + chr(96) + "articles/test.html" + chr(96) + "\n"
            result = module.render(rows, original,
                                   {"https://denkicontrol.com/articles/test.html"},
                                   date(2026, 11, 2), None, root)
            self.assertIn("articles/test.html", result)
            self.assertIn("完成・凍結", result)
            self.assertNotIn("unpublished.html", result)

    def test_sitemap_domain_filter(self):
        with tempfile.TemporaryDirectory() as temp:
            f = Path(temp) / "sitemap.xml"
            f.write_text(
                '<urlset><url><loc>https://denkicontrol.com/articles/good.html</loc></url>'
                '<url><loc>https://evil.example/articles/bad.html</loc></url>'
                '<url><loc>https://denkicontrol.com/en/articles/english.html</loc></url></urlset>',
                encoding="utf-8")
            self.assertEqual(module.published_articles(f),
                             {"https://denkicontrol.com/articles/good.html"})

    def test_stale_data_does_not_modify_backlog(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            (root / "docs").mkdir()
            (root / module.BACKLOG_REL).write_text("unaltered", encoding="utf-8")
            with patch.object(module, "api_rows", return_value=[{"data_date": "2026-10-15"}]):
                with self.assertRaises(module.ReportError):
                    module.build(root=root, today=date(2026, 11, 5))
            self.assertEqual((root / module.BACKLOG_REL).read_text(), "unaltered")


if __name__ == "__main__":
    unittest.main()
