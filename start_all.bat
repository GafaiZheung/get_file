@echo off
REM 一键启动Django后端和React前端，并维护上传接口URL

start cmd /k "cd /d %~dp0 && call .venv\Scripts\activate && python manage.py runserver"
start cmd /k "cd /d %~dp0\frontend && npm run dev -- --port"

pause
