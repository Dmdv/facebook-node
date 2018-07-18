'use strict';

const BootBot = require("bootbot");
const config = require("config");

console.log("Starting");

console.log("Access token: " + config.get('access_token'));
console.log("Verify token: " + config.get('verify_token'));
console.log("App secret: " + config.get('app_secret'));

const bot = new BootBot({
    accessToken: config.get('access_token'),
    verifyToken: config.get('verify_token'),
    appSecret: config.get('app_secret')
  });

  bot.setGreetingText("Hello, I'm here to help you manage your tasks. Be sure to setup your bucket by typing 'Setup'. ");
  
  bot.on('message', (payload, chat) => {
    console.log("Hi");
    const text = payload.message.text;
    chat.say('Echo: ${text}');
  });

  console.log("Bot started");
  
  bot.start();