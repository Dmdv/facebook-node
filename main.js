'use strict';

const BootBot = require("bootbot");
const config = require("config");
const format = require('string-format');
const localtunnel = require("localtunnel");
const chrono = require('chrono-node');

// logging

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

// localtunnel

console.log(format("Running localtunnel on domain: '{}'", config.get('subdomain')));

const tunnel = localtunnel(config.get('bot_port'), {
  subdomain: config.get('subdomain')
}, function (err, tunnel) {

  if (err) {
    console.warn("Failed to start localtunnel:");
    console.warn(err);
    return;
  }

  console.log(format('Localtunnel is started on: "{}"', tunnel.url));
});

tunnel.on('close', () => {
  console.warn("localtunnel is closed");
});

// BOT

const bot = new BootBot({
  accessToken: config.get('access_token'),
  verifyToken: config.get('verify_token'),
  appSecret: config.get('app_secret')
});

// Приветствие и кнопка 'Начать'

bot.setGreetingText("Hello, I'm here to help you manage your tasks. Be sure to setup your bucket by typing 'Setup'. ");

bot.setGetStartedButton((payload, chat) => {

  chat.say(config.get('greeting'));
  
  console.warn(format("BotUserId = {}", payload.sender.id));
});

// Persistent menu

// Setting this to true would disable the text input on mobile
// and the user will only be able to communicate via the persistent menu.
const disableInput = true;

bot.setPersistentMenu([{
    title: 'My Account',
    type: 'nested',
    call_to_actions: [{
        title: 'Pay Bill',
        type: 'postback',
        payload: 'PAYBILL_PAYLOAD'
      },
      {
        title: 'History',
        type: 'postback',
        payload: 'HISTORY_PAYLOAD'
      },
      {
        title: 'Contact Info',
        type: 'postback',
        payload: 'CONTACT_INFO_PAYLOAD'
      }
    ]
  },
  {
    title: 'Go to Website',
    type: 'web_url',
    url: 'http://purple.com'
  }
], disableInput);

// On receiving any message

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

// Message with quick replies

bot.hear('colors', (payload, chat) => {
  console.log("Got quick reply");
  chat.say({
    text: 'Favorite color?',
    quickReplies: ['Red', 'Blue', 'Green']
  });
});

// Answering buttons

bot.on('postback:HELP_SETTINGS', (payload, chat) => {
  console.log('The Help Me button was clicked!');
  chat.say("You clicked HELP_SETTINGS");
});


bot.on('postback:PAYBILL_PAYLOAD', (payload, chat) => {
  chat.say(`Pay Bill here...`);
});

bot.on('postback:HISTORY_PAYLOAD', (payload, chat) => {
  chat.say(`History here...`);
});

bot.on('postback:CONTACT_INFO_PAYLOAD', (payload, chat) => {
  chat.say(`Contact info here...`);
});


console.log("Bot started");

bot.start(config.get('bot_port'));