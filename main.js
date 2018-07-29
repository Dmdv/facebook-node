'use strict';

const BootBot = require("bootbot");
const config = require("config");
const format = require('string-format');
const localtunnel = require("localtunnel");

require('console-stamp')(
  console, {
    pattern: 'dd/mm HH:MM:ss',
    colors: {
      stamp: 'yellow',
      label: 'white',
      metadata: 'green'
    }
  });

console.log("Starting");

console.log("Access token: " + config.get('access_token'));
console.log("Verify token: " + config.get('verify_token'));
console.log("App secret: " + config.get('app_secret'));

console.log(format("Running localtunnel on domain: '{}'", config.get('subdomain')))

var tunnel = localtunnel(config.get('bot_port'), {
  subdomain: config.get('subdomain')
}, function (err, tunnel) {

  if (err) {
    console.warn("Failed to start localtunnel:");
    console.warn(err);
    return;
  }

  console.log(format('Localtunnel is started on: "{}"', tunnel.url));
});

tunnel.on('close', function () {
  console.warn("localtunnel is closed");
});

const bot = new BootBot({
  accessToken: config.get('access_token'),
  verifyToken: config.get('verify_token'),
  appSecret: config.get('app_secret')
});

bot.setGreetingText("Hello, I'm here to help you manage your tasks. Be sure to setup your bucket by typing 'Setup'. ");

bot.on('message', (payload, chat) => {
  console.log("--- new message from chat ---");
  console.log(format('Hello, {}!', 'Alice'));
  const text = payload.message.text;
  console.log(text);
  chat.say(text);
});

console.log("Bot started");

bot.start(config.get('bot_port'));