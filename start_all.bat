@echo off
REM 一键启动Django后端和React前端，并维护上传接口URL

set BACKEND_PORT=8000
set FRONTEND_PORT=5173
set UPLOAD_URL=http://localhost:%BACKEND_PORT%/api/upload/

start cmd /k "cd /d %~dp0 && call .venv\Scripts\activate && python manage.py runserver %BACKEND_PORT%"
start cmd /k "cd /d %~dp0\frontend && npm run dev -- --port %FRONTEND_PORT%"

echo 当前上传接口URL: %UPLOAD_URL%
pause
