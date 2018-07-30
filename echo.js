'use strict';

const BootBot = require("bootbot");
const config = require("config");
const format = require('string-format');
const localtunnel = require("localtunnel");
const chrono = require('chrono-node');

console.log("Starting");

console.log("Access token: " + config.get('access_token'));
console.log("Verify token: " + config.get('verify_token'));
console.log("App secret: " + config.get('app_secret'));

console.log(format("Running localtunnel on domain: '{}'", config.get('subdomain')));

var tunnel = localtunnel(config.get('bot_port'), { subdomain : config.get('subdomain') }, function (err, tunnel) {

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

// Bot hears 'Hello'

bot.hear(['hello', 'hey', 'sup'], (payload, chat) => {
    chat.getUserProfile().then((user) => {
        chat.say(`Hey ${user.first_name}, How are you today?`)
    })
});


// Bot hears 'Create' and creates conversation

bot.hear('create', (payload, chat) => {

    chat.conversation((convo) => {

        convo.ask("What would you like your reminder to be? etc 'I have an appointment tomorrow from 10 to 11 AM' the information will be added automatically", (payload, convo) => { // 1

            try {
                let datetime = chrono.parseDate(payload.message.text);
                console.log(format("The date you've entered is: ", datetime));
            } catch (error) {
                convo.say("Sorry, couldn't understand the data. Try again");
                convo.end();
            }
        })
    })
});


// Message with quick replies

bot.hear('colors', (payload, chat) => {
    console.log("Got quick reply");
    chat.say({
        text: 'Favorite color?',
        quickReplies: ['Red', 'Blue', 'Green']
    });
});


// Help with buttons

bot.hear(['help'], (payload, chat) => {

    // Send a text message with buttons
    chat.say({
        text: 'What do you need help with?',
        buttons: [{
            type: 'postback',
            title: 'Settings',
            payload: 'HELP_SETTINGS'
        },
            {
                type: 'postback',
                title: 'FAQ',
                payload: 'HELP_FAQ'
            },
            {
                type: 'postback',
                title: 'Talk to a human',
                payload: 'HELP_HUMAN'
            }
        ]
    });
});

// Help with message

bot.hear('help text', (payload, chat) => {
    chat.say('Here are the following commands for use.');
    chat.say("'create': add a new reminder");
    chat.say("'setup': add your bucket info such as slug and write key");
    chat.say("'config': lists your current bucket config");
});

console.log("Bot started");

bot.start(config.get('bot_port'));