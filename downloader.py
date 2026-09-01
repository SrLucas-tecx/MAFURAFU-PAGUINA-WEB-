#!/usr/bin/env python3
"""
MAFURAFU Crafts & Hub — Descargador de Videos
=============================================
Requiere: pip install yt-dlp
Uso: python downloader.py
Servidor local: http://localhost:5050

Soporta: YouTube, TikTok, Instagram, Facebook, Twitter/X,
         Vimeo, Pinterest, Reddit y +1000 sitios más.
"""

import json
import os
import re
import shutil
import subprocess
import tempfile
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse

# Configuración básica
DOWNLOAD_DIR = Path.home() / "Downloads" / "MAFURAFU_Videos"
DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)

PORT = 5050
DEFAULT_FORMAT = "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best"


def find_ffmpeg_path() -> str | None:
    """Busca automáticamente FFmpeg en el PATH o en las carpetas de WinGet/Sistema."""
    if shutil.which("ffmpeg"):
        return None  # Ya está en el PATH global

    local_app_data = os.environ.get("LOCALAPPDATA", "")
    program_files = os.environ.get("ProgramFiles", "C:\\Program Files")

    search_dirs = [
        Path(local_app_data) / "Microsoft" / "WinGet" / "Links",
        Path(local_app_data) / "Microsoft" / "WinGet" / "Packages",
        Path("C:/ffmpeg/bin"),
        Path(program_files) / "ffmpeg" / "bin",
    ]

    for base_dir in search_dirs:
        if base_dir.exists():
            ffmpeg_executable = list(base_dir.rglob("ffmpeg.exe"))
            if ffmpeg_executable:
                folder = str(ffmpeg_executable[0].parent)
                os.environ["PATH"] += os.pathsep + folder
                return folder
    return None


def get_base_cmd() -> list:
    """Genera los argumentos base ejecutando yt-dlp como módulo de Python."""
    cmd = [sys.executable, "-m", "yt_dlp", "--js-runtimes", "node"]
    ffmpeg_dir = find_ffmpeg_path()
    if ffmpeg_dir:
        cmd.extend(["--ffmpeg-location", ffmpeg_dir])
    return cmd


def detect_platform(url: str) -> str:
    """Detecta la plataforma de origen de la URL."""
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
    return "Otro"


def get_info(url: str) -> dict:
    """Extrae metadatos del video sin descargarlo."""
    try:
        cmd = get_base_cmd() + ["--dump-json", "--no-playlist", "--", url]
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=30,
        )
        if result.returncode == 0:
            info = json.loads(result.stdout.split("\n")[0])
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
        return {"ok": False, "error": str(e)}
    return {"ok": False, "error": "No se pudo obtener información del video"}


def get_transcript(url: str) -> dict:
    """Obtiene la transcripción o subtítulos automáticos del video."""
    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            cmd = get_base_cmd() + [
                "--write-auto-sub",
                "--sub-lang",
                "es,en",
                "--sub-format",
                "vtt",
                "--skip-download",
                "--no-playlist",
                "-o",
                f"{tmpdir}/%(id)s",
                "--",
                url,
            ]
            subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=60,
            )
            vtt_files = list(Path(tmpdir).glob("*.vtt"))
            if vtt_files:
                raw = vtt_files[0].read_text(encoding="utf-8", errors="ignore")
                lines = []
                for line in raw.split("\n"):
                    line = line.strip()
                    if (
                        not line
                        or line.startswith("WEBVTT")
                        or "-->" in line
                        or line.isdigit()
                        or re.match(r"^\d{2}:\d{2}", line)
                    ):
                        continue
                    line = re.sub(r"<[^>]+>", "", line)
                    if line:
                        lines.append(line)
                deduped = []
                for l in lines:
                    if not deduped or deduped[-1] != l:
                        deduped.append(l)
                transcript = " ".join(deduped)
                lang = vtt_files[0].stem.split(".")[-1]
                return {"ok": True, "transcript": transcript, "lang": lang}
    except Exception as e:
        return {"ok": False, "error": str(e)}
    return {
        "ok": False,
        "error": "No hay transcripción o subtítulos disponibles para este video",
    }


def download_video(url: str, fmt: str = DEFAULT_FORMAT) -> dict:
    """Descarga el video en la carpeta MAFURAFU_Videos."""
    try:
        platform = detect_platform(url)
        safe_name = re.sub(r"[^\w\-]", "_", platform)
        out_template = str(
            DOWNLOAD_DIR / f"{safe_name}_%(title)s_%(id)s.%(ext)s"
        )

        cmd = get_base_cmd() + [
            "-f",
            fmt,
            "--merge-output-format",
            "mp4",
            "--no-playlist",
            "--add-metadata",
            "-o",
            out_template,
            "--",
            url,
        ]

        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=300,
        )

        if result.returncode == 0:
            valid_files = [
                f
                for f in DOWNLOAD_DIR.iterdir()
                if f.is_file() and not f.name.endswith((".part", ".ytdl"))
            ]
            files = sorted(
                valid_files, key=lambda f: f.stat().st_mtime, reverse=True
            )
            if files:
                return {
                    "ok": True,
                    "file": str(files[0]),
                    "filename": files[0].name,
                    "size_mb": round(files[0].stat().st_size / (1024 * 1024), 2),
                    "platform": platform,
                }
        return {
            "ok": False,
            "error": result.stderr[-500:] or "Error desconocido durante la descarga",
        }
    except FileNotFoundError:
        return {
            "ok": False,
            "error": "yt-dlp no está instalado o no se encuentra en el PATH.",
        }
    except Exception as e:
        return {"ok": False, "error": str(e)}


class Handler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # Oculta logs HTTP para mantener limpia la consola

    def send_json(self, data: dict, status: int = 200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
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

        if parsed.path == "/ping":
            self.send_json({"ok": True, "message": "MAFURAFU Downloader activo 🧶"})

        elif parsed.path == "/info":
            if not url:
                self.send_json({"ok": False, "error": "Falta el parámetro 'url'"}, 400)
            else:
                self.send_json(get_info(url))

        elif parsed.path == "/transcript":
            if not url:
                self.send_json({"ok": False, "error": "Falta el parámetro 'url'"}, 400)
            else:
                self.send_json(get_transcript(url))

        elif parsed.path == "/download":
            if not url:
                self.send_json({"ok": False, "error": "Falta el parámetro 'url'"}, 400)
            else:
                fmt = unquote(qs.get("format", [DEFAULT_FORMAT])[0])
                self.send_json(download_video(url, fmt))

        elif parsed.path == "/downloads":
            files = []
            valid_files = [
                f
                for f in DOWNLOAD_DIR.iterdir()
                if f.is_file() and not f.name.endswith((".part", ".ytdl"))
            ]
            for f in sorted(
                valid_files, key=lambda x: x.stat().st_mtime, reverse=True
            ):
                files.append(
                    {
                        "name": f.name,
                        "size_mb": round(f.stat().st_size / (1024 * 1024), 2),
                        "path": str(f),
                    }
                )
            self.send_json({"ok": True, "files": files[:50]})

        else:
            self.send_json({"ok": False, "error": "Ruta no encontrada"}, 404)


def run():
    print(f"\n🧶 MAFURAFU Downloader listo en http://localhost:{PORT}")
    print(f"📁 Guardando videos en: {DOWNLOAD_DIR}")
    print("   Presiona Ctrl+C para detener el servidor.\n")
    server = ThreadingHTTPServer(("localhost", PORT), Handler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Servidor detenido correctamente.")


if __name__ == "__main__":
    run()