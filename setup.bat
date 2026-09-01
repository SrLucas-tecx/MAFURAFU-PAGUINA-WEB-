@echo off
echo ==============================================
echo Instalando dependencias de MAFURAFU HUB...
echo ==============================================

echo [1/3] Instalando FFmpeg y Node.js...
winget install ffmpeg --accept-package-agreements --accept-source-agreements
winget install OpenJS.NodeJS --accept-package-agreements --accept-source-agreements

echo [2/3] Creando entorno virtual...
python -m venv .venv
call .venv\Scripts\activate

echo [3/3] Instalando librerias de Python...
python -m pip install --upgrade pip
pip install -r requirements.txt

echo.
echo ==============================================
echo ¡Instalacion completada! Ya puedes ejecutar downloader.py
echo ==============================================
pause