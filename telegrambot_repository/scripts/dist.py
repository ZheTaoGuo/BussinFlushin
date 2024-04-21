import scripts.build as build
import scripts.get_ca_cert as get_ca_cert
import scripts.zip as zip


def start():
    build.start()
    get_ca_cert.start()
    zip.start()
    print("Lambda package created successfully.")


if __name__ == "__main__":
    start()
