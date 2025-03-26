import os
import json
import requests

# 🧭 Директорія, де лежить сам скрипт
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(BASE_DIR, "conditions.json")

# ✅ Відкриваємо файл
with open(JSON_PATH, encoding="utf-8-sig") as f:
    data = json.load(f)

# Створюємо папки для іконок
os.makedirs(os.path.join(BASE_DIR, "icons/day"), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, "icons/night"), exist_ok=True)

# Завантаження
base_url = "https://cdn.weatherapi.com/weather/64x64"

for entry in data:
    icon_code = entry["icon"]
    for time in ["day", "night"]:
        url = f"{base_url}/{time}/{icon_code}.png"
        dest = os.path.join(BASE_DIR, f"icons/{time}/{icon_code}.png")
        if not os.path.exists(dest):
            print(f"⬇️  Downloading {url} → {dest}")
            r = requests.get(url)
            if r.status_code == 200:
                with open(dest, "wb") as img:
                    img.write(r.content)
            else:
                print(f"❌ Failed to download {url} (status {r.status_code})")
