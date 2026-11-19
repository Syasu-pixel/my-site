#!/usr/bin/env python3
import os
import unittest
from unittest.mock import patch

import search_data_entrypoint as entry


class SearchDataEntrypointTests(unittest.TestCase):
    def test_bing_api_key_counts_as_configured(self):
        with patch.dict(
            os.environ,
            {
                "BING_WEBMASTER_API_KEY": "test-key",
                "BING_WEBMASTER_SITE_URL": "https://denkicontrol.com/",
            },
            clear=True,
        ):
            self.assertTrue(entry._provider_configured("bing"))

    def test_bing_api_key_uses_json_rest_endpoint(self):
        with patch.dict(
            os.environ,
            {
                "BING_WEBMASTER_API_KEY": "test key",
                "BING_WEBMASTER_SITE_URL": "https://denkicontrol.com/",
            },
            clear=True,
        ):
            with patch.object(entry.sync, "json_request", return_value={"d": []}) as request:
                rows = entry._bing_get_with_api_key(
                    "GetPageStats",
                    "https://denkicontrol.com/",
                    "unused-oauth-token",
                )
        self.assertEqual(rows, [])
        called_url = request.call_args.args[0]
        self.assertTrue(called_url.startswith("https://ssl.bing.com/webmaster/api.svc/json/GetPageStats?"))
        self.assertIn("apikey=test+key", called_url)
        self.assertIn("siteUrl=https%3A%2F%2Fdenkicontrol.com%2F", called_url)

    def test_bing_api_key_skips_oauth_refresh(self):
        with patch.dict(os.environ, {"BING_WEBMASTER_API_KEY": "test-key"}, clear=True):
            with patch.object(entry, "_ORIGINAL_BING_REFRESH", side_effect=AssertionError("OAuth must not run")):
                self.assertEqual(entry._refresh_bing_token_if_needed(), "")


if __name__ == "__main__":
    unittest.main(verbosity=2)
