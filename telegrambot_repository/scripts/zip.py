import shutil


def start():
    # Zip lambda directory
    shutil.make_archive(
        base_name="dist/lambda",
        format="zip",
        root_dir="dist/lambda",
    )

    print("created 'dist/lambda.zip'")


if __name__ == "__main__":
    start()
