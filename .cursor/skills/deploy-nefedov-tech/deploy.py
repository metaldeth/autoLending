#!/usr/bin/env python3
"""
Deploy a site from this repo to reg.ru hosting via SFTP.
Config: deploy.env in the same directory (HOST, USER, PASS, REMOTE_DIR, SITE_URL, LOCAL_SITE).
"""
import paramiko
from pathlib import Path

# ── Config ────────────────────────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).parent
REPO_ROOT = SCRIPT_DIR.parent.parent

def load_env(path):
    cfg = {}
    with open(path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                cfg[k.strip()] = v.strip()
    return cfg

cfg = load_env(SCRIPT_DIR / "deploy.env")

HOST       = cfg["HOST"]
PORT       = int(cfg.get("PORT", 22))
USER       = cfg["USER"]
PASS       = cfg["PASS"]
REMOTE_DIR = cfg["REMOTE_DIR"]
SITE_URL   = cfg.get("SITE_URL", "").rstrip("/")
LOCAL_SITE = cfg["LOCAL_SITE"]

SITE_DIR = REPO_ROOT / LOCAL_SITE

# Files/dirs to upload (local path → remote subpath)
DEPLOY_FILES = [
    "index.html",
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
DEPLOY_DIRS = [
    "css",
    "js",
]

# ── SFTP helpers ──────────────────────────────────────────────────────────────

def sftp_mkdir_p(sftp, remote_dir):
    """Recursively create remote directory."""
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


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    if not SITE_DIR.is_dir():
        print(f"Error: site dir not found: {SITE_DIR}")
        return
    print(f"Connecting to {USER}@{HOST}:{PORT} ...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, port=PORT, username=USER, password=PASS, timeout=30)
    sftp = ssh.open_sftp()
    print(f"Connected. Uploading to {REMOTE_DIR}\n")

    # Ensure remote base dir exists
    sftp_mkdir_p(sftp, REMOTE_DIR)

    # Upload individual files
    for fname in DEPLOY_FILES:
        local = SITE_DIR / fname
        if not local.exists():
            print(f"  [SKIP] {fname} not found locally")
            continue
        upload_file(sftp, local, f"{REMOTE_DIR}/{fname}")

    # Upload directories
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
