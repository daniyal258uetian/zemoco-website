#!/usr/bin/env python3
"""Local server with clean URLs (no .html)."""
from __future__ import annotations

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse


ROOT = Path(__file__).resolve().parent


class CleanURLHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, directory: str | None = None, **kwargs):
        super().__init__(*args, directory=directory or str(ROOT), **kwargs)

    def do_GET(self):  # noqa: N802
        parsed = urlparse(self.path)
        path = unquote(parsed.path)

        # Map /page -> /page/ or /page/index.html
        candidate = self._resolve(path)
        if candidate is not None:
            self.path = candidate + (("?" + parsed.query) if parsed.query else "")

        return super().do_GET()

    def _resolve(self, path: str) -> str | None:
        if path in ("", "/"):
            return "/"

        # Already a real file under root
        rel = path.lstrip("/")
        file_path = ROOT / rel
        if file_path.is_file():
            return path

        # Directory with index.html
        if file_path.is_dir() and (file_path / "index.html").is_file():
            return path if path.endswith("/") else path + "/"

        # Extensionless page: /services -> /services/
        if "." not in Path(rel).name:
            as_dir = ROOT / rel
            if (as_dir / "index.html").is_file():
                return "/" + rel.strip("/") + "/"
            # Legacy fallback: /services.html
            html_file = ROOT / f"{rel}.html"
            if html_file.is_file():
                return "/" + rel + ".html"

        return None

    def log_message(self, fmt: str, *args) -> None:
        print("[%s] %s" % (self.log_date_time_string(), fmt % args))


def main() -> None:
    parser = argparse.ArgumentParser(description="Serve Zemoco site with clean URLs")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=5500)
    args = parser.parse_args()

    handler = partial(CleanURLHandler, directory=str(ROOT))
    server = ThreadingHTTPServer((args.host, args.port), handler)
    print(f"Zemoco site running at http://{args.host}:{args.port}/")
    print("Pages: /  /services  /coverage  /fleet  /compliance  /contact")
    print("Press Ctrl+C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
        server.server_close()


if __name__ == "__main__":
    main()
