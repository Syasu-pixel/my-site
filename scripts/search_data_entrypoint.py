#!/usr/bin/env python3
"""Search-data sync entrypoint with Bing API-key support.

Google keeps the OAuth refresh-token flow implemented in search_data_sync.py.
For Bing, a repository secret named BING_WEBMASTER_API_KEY is preferred because
Microsoft's current JSON/HTTP Webmaster API supports an API key on REST calls.
If that secret is absent, the existing Bing OAuth flow remains available as a
fallback for compatibility.
"""

from __future__ import annotations

import os
import urllib.parse
from typing import Any

import search_data_sync as sync

BING_API_KEY_BASE = "https://ssl.bing.com/webmaster/api.svc/json"

_ORIGINAL_BING_GET = sync._bing_get
_ORIGINAL_BING_REFRESH = sync.refresh_bing_access_token
_ORIGINAL_PROVIDER_CONFIGURED = sync.provider_configured


def _bing_get_with_api_key(method_name: str, site_url: str, token: str) -> list[dict[str, Any]]:
    api_key = os.getenv("BING_WEBMASTER_API_KEY", "")
    if not api_key:
        return _ORIGINAL_BING_GET(method_name, site_url, token)

    qs = urllib.parse.urlencode({"apikey": api_key, "siteUrl": site_url})
    endpoint = f"{BING_API_KEY_BASE}/{method_name}?{qs}"
    data = sync.json_request(endpoint) or {}
    payload = data.get("d", data)
    if isinstance(payload, dict):
        for value in payload.values():
            if isinstance(value, list):
                payload = value
                break
    if not isinstance(payload, list):
        raise sync.SyncError(f"Bing {method_name} response did not contain a row list")
    return [item for item in payload if isinstance(item, dict)]


def _refresh_bing_token_if_needed() -> str:
    if os.getenv("BING_WEBMASTER_API_KEY", ""):
        return ""
    return _ORIGINAL_BING_REFRESH()


def _provider_configured(provider: str) -> bool:
    if provider == "bing":
        if os.getenv("BING_WEBMASTER_API_KEY") and os.getenv("BING_WEBMASTER_SITE_URL"):
            return True
    return _ORIGINAL_PROVIDER_CONFIGURED(provider)


def install_auth_overrides() -> None:
    sync._bing_get = _bing_get_with_api_key
    sync.refresh_bing_access_token = _refresh_bing_token_if_needed
    sync.provider_configured = _provider_configured


def main(argv: list[str] | None = None) -> int:
    install_auth_overrides()
    return sync.main(argv)


if __name__ == "__main__":
    raise SystemExit(main())
