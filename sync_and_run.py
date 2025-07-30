import json
import os
import subprocess
import sys

print("[INFO] 开始同步配置并启动服务...")
# 1. 读取 config.json
with open('config.json', 'r', encoding='utf-8') as f:
    config = json.load(f)

backend_port = config.get('backend_port', 8000)
frontend_port = config.get('frontend_port', 3000)
upload_url = config.get('upload_url', f'http://localhost:{backend_port}/api/upload/')

# 2. 同步到后端 settings.py
backend_settings_path = os.path.join('backend', 'settings.py')
with open(backend_settings_path, 'r', encoding='utf-8') as f:
    settings = f.read()

# 替换端口和上传URL（假设有自定义变量 BACKEND_PORT, UPLOAD_URL）
import re
settings = re.sub(r"BACKEND_PORT\s*=\s*\d+", f"BACKEND_PORT = {backend_port}", settings)
settings = re.sub(r"UPLOAD_URL\s*=\s*['\"].*?['\"]", f"UPLOAD_URL = '{upload_url}'", settings)

# 自动同步 CORS_ALLOWED_ORIGINS
cors_pattern = r"CORS_ALLOWED_ORIGINS\\s*=\\s*\\[[^\\]]*\\]"
new_cors = f"CORS_ALLOWED_ORIGINS = [\n    'http://localhost:{frontend_port}',\n    'http://127.0.0.1:{frontend_port}',\n]"
if re.search(cors_pattern, settings):
    settings = re.sub(cors_pattern, new_cors, settings)
else:
    # 若未找到则追加到末尾
    settings += f"\n{new_cors}\n"

with open(backend_settings_path, 'w', encoding='utf-8') as f:
    f.write(settings)

# 3. 同步到前端 src/config.js（如无则新建）
frontend_config_path = os.path.join('frontend', 'src', 'config.js')
frontend_config = f"""
export const BACKEND_PORT = {backend_port};
export const FRONTEND_PORT = {frontend_port};
export const UPLOAD_URL = '{upload_url}';
"""
with open(frontend_config_path, 'w', encoding='utf-8') as f:
    f.write(frontend_config)

# 4. 启动后端和前端
# 后端

# 后端启动（指定cwd为项目根目录）

# 检查是否带 --hide 参数
hide_window = '--hide' in sys.argv
if hide_window:
    print("[INFO] 以隐藏窗口方式启动后端服务...")
    subprocess.Popen(
        ["python", "manage.py", "runserver", f"0.0.0.0:{backend_port}"],
        cwd=os.path.abspath('.'),
        creationflags=subprocess.CREATE_NO_WINDOW
    )
    print("[INFO] 以隐藏窗口方式启动前端服务...")
    subprocess.Popen(
        ["npm", "run", "dev", "--", "--port", str(frontend_port)],
        cwd=os.path.abspath('frontend'),
        creationflags=subprocess.CREATE_NO_WINDOW
    )
    print("[INFO] 同步完成，前后端服务已在后台隐藏窗口启动。")
else:
    print("[INFO] 启动后端服务...")
    subprocess.Popen(
        f'start cmd /k "python manage.py runserver 0.0.0.0:{backend_port}"',
        cwd=os.path.abspath('.'),
        shell=True
    )
    print("[INFO] 启动前端服务...")
    subprocess.Popen(
        f'start cmd /k "npm run dev -- --port {frontend_port}"',
        cwd=os.path.abspath('frontend'),
        shell=True
    )
    print("[INFO] 同步完成，前后端服务已在新窗口启动。")
