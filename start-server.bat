@echo off
cd /d "%~dp0"
echo.
echo  Zemoco website — local server
echo  Open: http://127.0.0.1:5500/
echo  Pages: /services /coverage /fleet /compliance /contact
echo  Press Ctrl+C to stop.
echo.
python server.py --host 127.0.0.1 --port 5500
pause
