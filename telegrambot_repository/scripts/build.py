import glob
import os
import shutil
from pathlib import Path


def start():
    # Install dependencies using poetry
    os.system("poetry install --only main --sync --no-root")

    # Create directory for lambda package
    outdir = Path("dist") / "lambda"
    outdir.mkdir(parents=True, exist_ok=True)

    # Copy site-packages and project source directory to lambda-package
    site_packages_globs = [
        ".venv/lib/python*/site-packages",
        ".venv/Lib/site-packages",
    ]
    ignores = ["*pip*"]

    site_packages = set()
    for site_packages_glob in site_packages_globs:
        site_packages |= set(glob.glob(site_packages_glob))

    for fp in site_packages:
        shutil.copytree(
            fp, outdir, ignore=shutil.ignore_patterns(*ignores), dirs_exist_ok=True
        )
    shutil.copytree("src", outdir, dirs_exist_ok=True)


if __name__ == "__main__":
    start()
