import json 
import os
import requests
import logging
import telebot 

TOKEN = os.environ.get("TOKEN")
def lambda_handler(event, context):
    message = event['message']
    if "text" in message:
        chat_id = message['chat']['id']
        os.environ['CHAT_ID'] = str(chat_id)
        text = message['text']
        if text: 
            bot = telebot.TeleBot(TOKEN)
            if text == "/start":
                send_start(bot, chat_id)
            elif text == "/help":
                send_help(bot, chat_id)
            else:
                send_unrecognized(bot, chat_id)
    else:
        chat_id = os.environ.get("CHAT_ID")
        url = f"https://api.telegram.org/bot/{TOKEN}/sendMessage"
        payload = {
            "chat_id": chat_id,
            "text": message
        }
        try: 
            response = requests.post(url, payload)
            if response.status_code == 200:
                return {
                    "statusCode": 200,
                    "body": "Message processed successfully"
                }
            elif response.status_code == 400:
                return {
                    "body": "Message not processed successfully",
                    "statusCode": 400
                }
        except Exception as e:
            logging.error(e)
            return {
                "statusCode": 500,
                "body": "This is error: {e}"
            }
            
def send_start(bot, chat_id):
    bot.send_message(chat_id, "Welcome to Notify! You will receive messages when there is someone in the toilet. To start the bot, type /start")

def send_help(bot, chat_id):
    bot.send_message(chat_id, "Please contact Team G1-T5 if you require help!")

def send_unrecognized(bot, chat_id):
    bot.send_message(chat_id, "Sorry, I do not understand what you are trying to say. Please type /help for assistance.")
    