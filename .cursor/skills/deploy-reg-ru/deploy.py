#!/usr/bin/env python3
"""
Общий деплой сайтов на reg.ru по SFTP.
У каждого сайта свой deploy.env в папке сайта (sites/<имя>/deploy.env).
Запуск: python deploy.py <имя-сайта>
"""
import sys
import paramiko
from pathlib import Path

# ── Config ────────────────────────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).parent
REPO_ROOT = SCRIPT_DIR.parent.parent.parent


def load_env(path):
    cfg = {}
    with open(path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                cfg[k.strip()] = v.strip()
    return cfg


def main():
    if len(sys.argv) < 2:
        print("Usage: python deploy.py <site-name>")
        print("Example: python deploy.py nefedov.tech")
        print("Deploy env: sites/<site-name>/deploy.env")
        sys.exit(1)

    site_name = sys.argv[1].strip()
    env_path = REPO_ROOT / "sites" / site_name / "deploy.env"
    SITE_DIR = env_path.parent

    if not env_path.exists():
        print(f"Error: deploy.env not found: {env_path}")
        sys.exit(1)

    cfg = load_env(env_path)
    HOST = cfg["HOST"]
    PORT = int(cfg.get("PORT", 22))
    USER = cfg["USER"]
    PASS = cfg["PASS"]
    REMOTE_DIR = cfg["REMOTE_DIR"]
    SITE_URL = cfg.get("SITE_URL", "").rstrip("/")

    # Files/dirs to upload — общий набор для типичного лендинга. Для другого набора правь здесь или делай отдельный скрипт под сайт.
    DEPLOY_FILES = [
        "index.html",
        "o-flow.html",
        "podpiska.html",
        "sostav.html",
        "dlya-klubov.html",
        "photo.png",
        "resume.pdf",
        "favicon.ico",
        "favicon.svg",
        "favicon-32.png",
        "apple-touch-icon.png",
        "favicon-192.png",
        "favicon-512.png",
        "site.webmanifest",
        "og-image.png",
    ]
    DEPLOY_DIRS = ["css", "js", "images", "img", "icons"]

    # ── SFTP helpers ────────────────────────────────────────────────────────────

    def sftp_mkdir_p(sftp, remote_dir):
        parts = remote_dir.rstrip("/").split("/")
        path = ""
        for part in parts:
            if not part:
                path = "/"
                continue
            path = f"{path}/{part}" if path != "/" else f"/{part}"
            try:
                sftp.stat(path)
            except FileNotFoundError:
                sftp.mkdir(path)

    def upload_file(sftp, local_path, remote_path):
        remote_dir = remote_path.rsplit("/", 1)[0]
        sftp_mkdir_p(sftp, remote_dir)
        sftp.put(str(local_path), remote_path)
        print(f"  [OK] {local_path.name} -> {remote_path}")

    def upload_dir(sftp, local_dir, remote_dir):
        sftp_mkdir_p(sftp, remote_dir)
        for item in sorted(local_dir.rglob("*")):
            if item.is_file():
                rel = item.relative_to(local_dir.parent)
                remote_path = f"{remote_dir.rstrip('/')}/{'/'.join(rel.parts[1:])}"
                upload_file(sftp, item, remote_path)

    # ── Deploy ──────────────────────────────────────────────────────────────────

    if not SITE_DIR.is_dir():
        print(f"Error: site dir not found: {SITE_DIR}")
        sys.exit(1)

    print(f"Deploying {site_name} ({SITE_DIR})")
    print(f"Connecting to {USER}@{HOST}:{PORT} ...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, port=PORT, username=USER, password=PASS, timeout=30)
    sftp = ssh.open_sftp()
    print(f"Connected. Uploading to {REMOTE_DIR}\n")

    sftp_mkdir_p(sftp, REMOTE_DIR)

    for fname in DEPLOY_FILES:
        local = SITE_DIR / fname
        if not local.exists():
            print(f"  [SKIP] {fname} not found locally")
            continue
        upload_file(sftp, local, f"{REMOTE_DIR}/{fname}")

    for dname in DEPLOY_DIRS:
        local = SITE_DIR / dname
        if not local.exists():
            print(f"  [SKIP] {dname}/ not found locally")
            continue
        print(f"  Uploading {dname}/")
        upload_dir(sftp, local, f"{REMOTE_DIR}/{dname}")

    sftp.close()
    ssh.close()
    print(f"\nDeploy complete. Check {SITE_URL or REMOTE_DIR}/")


if __name__ == "__main__":
    main()
