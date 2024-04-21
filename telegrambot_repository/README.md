# Telegram Bot

## Features

Alert Training Officers on students' whereabouts when using the toilet

## Prerequisites

- python ^3.12
- poetry ^1.7.1

## Commands

- `poetry shell` to activate the virtual environment
- `poetry install` to install dependencies
- `poetry run build` to create a virtual environment, install packages and output them to the `dist/lambda` folder
- `poetry run cert` to download the CA certificate from the AWS endpoint and save it to the `dist/lambda` folder
- `poetry run zip` to create the `dist/lambda.zip` from `dist/lambda` folder
- `poetry run dist` to run all of the above steps

## Usage

### Installation

Run `poetry shell` to activate the virtual environment and then run `poetry install` to install the required dependencies.

### Development

All code in `src/` will be compiled to `dist/` and then bundled to `dist/lambda/lambda.py` along with site packages from the generated `.venv /**/site-packages/**` virutal environment when running `poetry run build` or `poetry run dist`.

The `dist/lambda.zip` created by running `poetry run zip` or `poetry run dist`, is what will be used to deploy as a lambda function.

`src/lambda.py` is the entrypoint for the lambda function and the `handler` function will the main entry function that is called when the Lambda function is invoked.

While developing for lambda functions, it's CRITICAL to retain the same signature for the `handler` function (ie `lambda.handler`), as it's the entrypoint for the lambda function.

You can tell the Lambda runtime which handler method to invoke by setting the handler parameter on your function's configuration.

When you configure a function in Python, the value of the handler setting is the file name and the name of the handler module, separated by a dot. For example, `main.Handler` calls the `Handler` method defined in `main.py`.

See more at [Lambda function handler in Python](https://docs.aws.amazon.com/lambda/latest/dg/python-handler.html?icmpid=docs_lambda_help)

### Deployment

1. Ensure that you're in the lambda project root directory (where the `package.json` file is located)
2. Run `npm run dist` to create the `dist/lambda.zip` file
3. Upload the `dist/lambda.zip` file to the AWS Lambda console
4. Set the Lambda Handler on Lambda console to `lambda.handler`
