#!/usr/bin/env python3
import datetime as dt
import os
import unittest
from unittest.mock import patch

import search_data_sync as sync


class SearchDataSyncTests(unittest.TestCase):
    def test_date_range_ending_with_lag(self):
        got = sync.date_range_ending_with_lag(dt.date(2026, 9, 17), 3, 4)
        self.assertEqual(
            got,
            [
                dt.date(2026, 9, 11),
                dt.date(2026, 9, 12),
                dt.date(2026, 9, 13),
                dt.date(2026, 9, 14),
            ],
        )

    def test_provider_windows(self):
        with patch.dict(os.environ, {}, clear=True):
            google = sync.dates_for_provider("google", dt.date(2026, 9, 17))
            bing = sync.dates_for_provider("bing", dt.date(2026, 9, 17))
        self.assertEqual(google[0], dt.date(2026, 9, 11))
        self.assertEqual(google[-1], dt.date(2026, 9, 14))
        self.assertEqual(len(google), 4)
        self.assertEqual(bing[0], dt.date(2026, 9, 3))
        self.assertEqual(bing[-1], dt.date(2026, 9, 16))
        self.assertEqual(len(bing), 14)

    def test_gsc_normalization(self):
        rows = sync.normalize_gsc_rows(
            [
                {
                    "keys": ["2026-09-14", "https://denkicontrol.com/articles/example.html"],
                    "clicks": 12,
                    "impressions": 300,
                    "ctr": 0.04,
                    "position": 7.25,
                }
            ],
            site_url="sc-domain:denkicontrol.com",
            target_date=dt.date(2026, 9, 14),
            grain="page",
            dimensions=["date", "page"],
        )
        self.assertEqual(len(rows), 1)
        row = rows[0]
        self.assertEqual(row.source, "google")
        self.assertEqual(row.page, "https://denkicontrol.com/articles/example.html")
        self.assertEqual(row.clicks, 12)
        self.assertEqual(row.impressions, 300)
        self.assertAlmostEqual(row.avg_position or 0, 7.25)
        self.assertEqual(len(row.to_record()["record_key"]), 64)

    def test_record_key_is_deterministic_and_dimension_sensitive(self):
        base = sync.MetricRow(
            source="google",
            data_date="2026-09-14",
            site_url="sc-domain:denkicontrol.com",
            grain="query",
            query="plc 基礎",
            clicks=1,
            impressions=10,
        )
        same = sync.MetricRow(**{**base.__dict__, "clicks": 9})
        other = sync.MetricRow(**{**base.__dict__, "query": "plc 入門"})
        self.assertEqual(base.to_record()["record_key"], same.to_record()["record_key"])
        self.assertNotEqual(base.to_record()["record_key"], other.to_record()["record_key"])

    def test_parse_bing_dotnet_date(self):
        self.assertEqual(sync.parse_bing_date("/Date(1316156400000-0700)/"), "2011-09-16")

    def test_parse_bing_iso_date(self):
        self.assertEqual(sync.parse_bing_date("2026-09-14T00:00:00Z"), "2026-09-14")

    def test_bing_query_normalization(self):
        rows = sync.normalize_bing_rows(
            [
                {
                    "Clicks": 15,
                    "Impressions": 100,
                    "Date": "/Date(1316156400000-0700)/",
                    "Query": "plc",
                    "AvgClickPosition": 18,
                    "AvgImpressionPosition": 17,
                }
            ],
            site_url="https://denkicontrol.com/",
            grain="query",
        )
        self.assertEqual(rows[0].query, "plc")
        self.assertEqual(rows[0].page, "")
        self.assertAlmostEqual(rows[0].ctr, 0.15)
        self.assertEqual(rows[0].avg_position, 17.0)
        self.assertEqual(rows[0].avg_click_position, 18.0)

    def test_bing_page_normalization(self):
        rows = sync.normalize_bing_rows(
            [
                {
                    "Clicks": 2,
                    "Impressions": 20,
                    "Date": "2026-09-14T00:00:00Z",
                    "Query": "https://denkicontrol.com/articles/example.html",
                    "AvgClickPosition": 9,
                    "AvgImpressionPosition": 8,
                }
            ],
            site_url="https://denkicontrol.com/",
            grain="page",
        )
        self.assertEqual(rows[0].page, "https://denkicontrol.com/articles/example.html")
        self.assertEqual(rows[0].query, "")

    def test_missing_credentials_is_safe_noop(self):
        required = [
            "GSC_CLIENT_ID",
            "GSC_CLIENT_SECRET",
            "GSC_REFRESH_TOKEN",
            "GSC_SITE_URL",
            "BING_WEBMASTER_CLIENT_ID",
            "BING_WEBMASTER_CLIENT_SECRET",
            "BING_WEBMASTER_REFRESH_TOKEN",
            "BING_WEBMASTER_SITE_URL",
            "SEARCH_DATA_SUPABASE_URL",
            "SEARCH_DATA_SUPABASE_SERVICE_ROLE_KEY",
        ]
        clean = {k: v for k, v in os.environ.items() if k not in required}
        with patch.dict(os.environ, clean, clear=True):
            self.assertEqual(sync.main(["--provider", "all"]), 0)


if __name__ == "__main__":
    unittest.main(verbosity=2)
