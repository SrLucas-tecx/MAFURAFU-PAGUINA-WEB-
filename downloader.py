#!/usr/bin/env python3
"""
MAFURAFU Crafts & Hub — Descargador de Videos
=============================================
Requiere: pip install yt-dlp
Uso: python downloader.py
Luego abre http://localhost:5050 en tu navegador.

SOPORTA: YouTube, TikTok, Instagram, Facebook, Twitter/X,
         Vimeo, Pinterest, Reddit, y +1000 sitios más (yt-dlp).
"""

import os
import json
import subprocess
import tempfile
import threading
import re
from pathlib import Path
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs, unquote

# ─────────────────────────────────────────────
# EDITAR AQUÍ: Carpeta donde se guardan los videos descargados
DOWNLOAD_DIR = Path.home() / "Downloads" / "MAFURAFU_Videos"
DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)

# EDITAR AQUÍ: Puerto del servidor local
PORT = 5050

# EDITAR AQUÍ: Formato preferido de descarga
DEFAULT_FORMAT = "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best"

# ─────────────────────────────────────────────

def detect_platform(url: str) -> str:
    """Detecta la plataforma del enlace."""
    domain = urlparse(url).netloc.lower()
    if "youtube.com" in domain or "youtu.be" in domain:
        return "YouTube"
    elif "tiktok.com" in domain:
        return "TikTok"
    elif "instagram.com" in domain:
        return "Instagram"
    elif "facebook.com" in domain or "fb.com" in domain:
        return "Facebook"
    elif "twitter.com" in domain or "x.com" in domain:
        return "Twitter/X"
    elif "vimeo.com" in domain:
        return "Vimeo"
    elif "pinterest.com" in domain:
        return "Pinterest"
    elif "reddit.com" in domain:
        return "Reddit"
    else:
        return "Otro"


def get_info(url: str) -> dict:
    """Obtiene información del video sin descargarlo."""
    try:
        result = subprocess.run(
            ["yt-dlp", "--dump-json", "--no-playlist", url],
            capture_output=True, text=True, timeout=30
        )
        if result.returncode == 0:
            info = json.loads(result.stdout.split('\n')[0])
            return {
                "ok": True,
                "title": info.get("title", "Sin título"),
                "duration": info.get("duration", 0),
                "thumbnail": info.get("thumbnail", ""),
                "platform": detect_platform(url),
                "uploader": info.get("uploader", ""),
                "description": (info.get("description", "") or "")[:500],
            }
    except Exception as e:
        pass
    return {"ok": False, "error": "No se pudo obtener información del video"}


def get_transcript(url: str) -> dict:
    """Intenta obtener la transcripción/subtítulos del video."""
    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            result = subprocess.run(
                [
                    "yt-dlp",
                    "--write-auto-sub",
                    "--sub-lang", "es,en",
                    "--sub-format", "vtt",
                    "--skip-download",
                    "--no-playlist",
                    "-o", f"{tmpdir}/%(id)s",
                    url
                ],
                capture_output=True, text=True, timeout=60
            )
            vtt_files = list(Path(tmpdir).glob("*.vtt"))
            if vtt_files:
                raw = vtt_files[0].read_text(encoding="utf-8", errors="ignore")
                lines = []
                for line in raw.split('\n'):
                    line = line.strip()
                    if (not line or line.startswith("WEBVTT") or
                            '-->' in line or line.isdigit() or
                            re.match(r'^\d{2}:\d{2}', line)):
                        continue
                    line = re.sub(r'<[^>]+>', '', line)
                    if line:
                        lines.append(line)
                deduped = []
                for l in lines:
                    if not deduped or deduped[-1] != l:
                        deduped.append(l)
                transcript = ' '.join(deduped)
                return {"ok": True, "transcript": transcript, "lang": vtt_files[0].stem.split('.')[-1]}
    except Exception as e:
        pass
    return {"ok": False, "error": "No hay transcripción disponible para este video"}


def download_video(url: str, fmt: str = DEFAULT_FORMAT) -> dict:
    """Descarga el video y retorna la ruta del archivo."""
    try:
        platform = detect_platform(url)
        safe_name = re.sub(r'[^\w\-]', '_', platform)
        out_template = str(DOWNLOAD_DIR / f"{safe_name}_%(title)s_%(id)s.%(ext)s")

        result = subprocess.run(
            [
                "yt-dlp",
                "-f", fmt,
                "--merge-output-format", "mp4",
                "--no-playlist",
                "--add-metadata",
                "-o", out_template,
                url
            ],
            capture_output=True, text=True, timeout=300
        )

        if result.returncode == 0:
            files = sorted(DOWNLOAD_DIR.iterdir(), key=lambda f: f.stat().st_mtime, reverse=True)
            if files:
                return {
                    "ok": True,
                    "file": str(files[0]),
                    "filename": files[0].name,
                    "size_mb": round(files[0].stat().st_size / 1024 / 1024, 2),
                    "platform": platform
                }
        return {"ok": False, "error": result.stderr[-500:] or "Error desconocido"}
    except FileNotFoundError:
        return {"ok": False, "error": "yt-dlp no está instalado o no está en el PATH."}
    except Exception as e:
        return {"ok": False, "error": str(e)}


class Handler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # Silenciar logs HTTP

    def send_json(self, data: dict, status: int = 200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", len(body))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        qs = parse_qs(parsed.query)
        url = unquote(qs.get("url", [""])[0])

        if parsed.path == "/info":
            if not url:
                self.send_json({"ok": False, "error": "Falta el parámetro url"}, 400)
            else:
                self.send_json(get_info(url))

        elif parsed.path == "/transcript":
            if not url:
                self.send_json({"ok": False, "error": "Falta el parámetro url"}, 400)
            else:
                self.send_json(get_transcript(url))

        elif parsed.path == "/download":
            if not url:
                self.send_json({"ok": False, "error": "Falta el parámetro url"}, 400)
            else:
                fmt = unquote(qs.get("format", [DEFAULT_FORMAT])[0])
                result = download_video(url, fmt)
                self.send_json(result)

        elif parsed.path == "/ping":
            self.send_json({"ok": True, "message": "MAFURAFU Downloader activo 🧶"})

        elif parsed.path == "/downloads":
            files = []
            for f in sorted(DOWNLOAD_DIR.iterdir(), key=lambda x: x.stat().st_mtime, reverse=True):
                if f.is_file():
                    files.append({
                        "name": f.name,
                        "size_mb": round(f.stat().st_size / 1024 / 1024, 2),
                        "path": str(f)
                    })
            self.send_json({"ok": True, "files": files[:50]})

        else:
            self.send_json({"ok": False, "error": "Ruta no encontrada"}, 404)


def run():
    print(f"\n🧶 MAFURAFU Downloader iniciado en http://localhost:{PORT}")
    print(f"📁 Videos se guardan en: {DOWNLOAD_DIR}")
    print("   Presiona Ctrl+C para detener.\n")
    server = HTTPServer(("localhost", PORT), Handler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Servidor detenido.")


if __name__ == "__main__":
    run()