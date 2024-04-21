import urllib.request
from pathlib import Path


def start():
    outfile = Path("dist") / "lambda" / "global-bundle.pem"
    outfile.parent.mkdir(parents=True, exist_ok=True)

    urllib.request.urlretrieve(
        "https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem",
        outfile,
    )


if __name__ == "__main__":
    start()
