#!/usr/bin/env python3
"""Validate and download an AI-produced binary artifact for a preview branch.

This script is intentionally provider-agnostic. It accepts an HTTPS artifact URL,
verifies host/path/extension/signature/size/SHA-256, and writes only under
assets/images/. It never decides whether content is publishable; it is only a
constrained writer.
"""

from __future__ import annotations

import argparse
import hashlib
import os
from pathlib import Path, PurePosixPath
from urllib.parse import urljoin, urlparse
from urllib.request import HTTPRedirectHandler, Request, build_opener

MAX_BYTES = 5 * 1024 * 1024
ALLOWED_EXTENSIONS = {".webp", ".png", ".jpg", ".jpeg"}
ALLOWED_BRANCH_PREFIXES = ("ai-", "preview-", "pilot-")


class SafeRedirectHandler(HTTPRedirectHandler):
    def __init__(self, allowed_hosts: set[str]):
        super().__init__()
        self.allowed_hosts = allowed_hosts

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        absolute = urljoin(req.full_url, newurl)
        _validate_url(absolute, self.allowed_hosts)
        return super().redirect_request(req, fp, code, msg, headers, absolute)


def _validate_url(url: str, allowed_hosts: set[str]) -> None:
    parsed = urlparse(url)
    if parsed.scheme != "https":
        raise ValueError("artifact_url must use https")
    host = (parsed.hostname or "").lower()
    if not host or host not in allowed_hosts:
        raise ValueError(f"artifact host is not allowed: {host or '<empty>'}")
    if parsed.username or parsed.password:
        raise ValueError("credentials in artifact_url are not allowed")


def _validate_branch(branch: str) -> None:
    if branch == "main" or not branch.startswith(ALLOWED_BRANCH_PREFIXES):
        raise ValueError("target branch must be a non-production ai-/preview-/pilot- branch")


def _validate_target_path(target: str) -> Path:
    posix = PurePosixPath(target)
    if posix.is_absolute() or ".." in posix.parts:
        raise ValueError("target_path must be a safe repository-relative path")
    if len(posix.parts) < 3 or posix.parts[0:2] != ("assets", "images"):
        raise ValueError("target_path must be under assets/images/")
    if posix.suffix.lower() not in ALLOWED_EXTENSIONS:
        raise ValueError("unsupported image extension")
    return Path(*posix.parts)


def _validate_image_signature(data: bytes, suffix: str) -> None:
    suffix = suffix.lower()
    if suffix == ".webp":
        valid = len(data) >= 12 and data[0:4] == b"RIFF" and data[8:12] == b"WEBP"
    elif suffix == ".png":
        valid = data.startswith(b"\x89PNG\r\n\x1a\n")
    elif suffix in {".jpg", ".jpeg"}:
        valid = data.startswith(b"\xff\xd8\xff")
    else:
        valid = False
    if not valid:
        raise ValueError(f"artifact content does not match {suffix} image signature")


def download(url: str, allowed_hosts: set[str]) -> bytes:
    _validate_url(url, allowed_hosts)
    opener = build_opener(SafeRedirectHandler(allowed_hosts))
    req = Request(url, headers={"User-Agent": "denkicontrol-ai-artifact-writer/0.1"})
    with opener.open(req, timeout=30) as response:
        data = response.read(MAX_BYTES + 1)
    if len(data) > MAX_BYTES:
        raise ValueError(f"artifact exceeds {MAX_BYTES} bytes")
    return data


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", required=True)
    parser.add_argument("--sha256", required=True)
    parser.add_argument("--target-path", required=True)
    parser.add_argument("--target-branch", required=True)
    parser.add_argument("--allowed-hosts", default=os.getenv("AI_ARTIFACT_ALLOWED_HOSTS", ""))
    args = parser.parse_args()

    allowed_hosts = {h.strip().lower() for h in args.allowed_hosts.split(",") if h.strip()}
    if not allowed_hosts:
        raise ValueError("AI_ARTIFACT_ALLOWED_HOSTS is empty; writer is intentionally disabled")

    _validate_branch(args.target_branch)
    target = _validate_target_path(args.target_path)
    data = download(args.url, allowed_hosts)

    actual = hashlib.sha256(data).hexdigest()
    expected = args.sha256.lower().strip()
    if actual != expected:
        raise ValueError(f"sha256 mismatch: expected {expected}, got {actual}")

    _validate_image_signature(data, target.suffix)

    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)
    print(f"validated {len(data)} bytes -> {target} sha256={actual}")


if __name__ == "__main__":
    main()
