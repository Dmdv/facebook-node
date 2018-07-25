'use strict';

const BootBot = require("bootbot");
const config = require("config");
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
//const app = express()
const Cosmic = require('cosmicjs');
//require('dotenv').config()
const chrono = require('chrono-node');
var schedule = require('node-schedule');

const EventEmitter = require('events').EventEmitter;

var config = {};
const reminders = [];
const eventEmitter = new EventEmitter();

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

  bot.setGetStartedButton((payload, chat) => {
    if(config.bucket === undefined) {
      chat.say('Hello my name is Note Buddy and I can help you keep track of your thoughts')
      chat.say("It seems like you have not setup your bucket settings yet. That has to be done before you can do anything else. Make sure to type 'setup'")
    }

    BotUserId = payload.sender.id
  });
  
  bot.on('message', (payload, chat) => {
    console.log("Hi");
    const text = payload.message.text;
    chat.say('Echo: ${text}');
  });


  // https://cosmicjs.com/blog/how-to-build-a-facebook-bot-app-using-nodejs


  // Setup

  bot.hear('setup', (payload, chat) => {

  const getBucketSlug = (convo) => {
    convo.ask("What's your buckets slug?", (payload, convo) => {
      var slug = payload.message.text;
      convo.set('slug', slug)
      convo.say("setting slug as "+slug).then(() => getBucketReadKey(convo));
    })
  }

  const getBucketReadKey = (convo) => {
    convo.ask("What's your buckets read key?", (payload, convo) => {
      var readkey = payload.message.text;
      convo.set('read_key', readkey)
      convo.say('setting read_key as '+readkey).then(() => getBucketWriteKey(convo))
    })
  }

  const getBucketWriteKey = (convo) => {
    convo.ask("What's your buckets write key?", (payload, convo) => {
      var writekey = payload.message.text
      convo.set('write_key', writekey)
      convo.say('setting write_key as '+writekey).then(() => finishing(convo))
    })
  }

  const finishing = (convo) => {
    var newConfigInfo = {
      slug: convo.get('slug'),
      read_key: convo.get('read_key'),
      write_key: convo.get('write_key')
    } 
    config.bucket = newConfigInfo
    convo.say('All set :)')
    convo.end();
  };
  
  chat.conversation((convo) => {
      getBucketSlug(convo)
    })
  })

  console.log("Bot started");

  // HELLO, HEY, SUP

  bot.hear(['hello', 'hey', 'sup'], (payload, chat)=>{
    chat.getUserProfile().then((user) => {
      chat.say(`Hey ${user.first_name}, How are you today?`)
    })
  })


  // create

  bot.hear('create', (payload, chat) => {

  chat.conversation((convo) => { 
    convo.ask("What would you like your reminder to be? etc 'I have an appointment tomorrow from 10 to 11 AM' the information will be added automatically", (payload, convo) => { // 1
      datetime = chrono.parseDate(payload.message.text) // 2
      var params = {
        write_key: config.bucket.write_key,
        type_slug: 'reminders',
        title: payload.message.text,
        metafields: [
         {
           key: 'date',
           type: 'text',
           value: datetime
         }
        ]
      } // 3

      Cosmic.addObject(config, params, function(error, response){ // 4
          if(!error){
            eventEmitter.emit('new', response.object.slug, datetime) //5
            convo.say("reminder added correctly :)")
            convo.end()
          } else {
            convo.say("there seems to be a problem. . .")
            convo.end()
          }
        })
      })
    })
  })

  // Help

  bot.hear('help', (payload, chat) => {
    chat.say('Here are the following commands for use.')
    chat.say("'create': add a new reminder")
    chat.say("'setup': add your bucket info such as slug and write key")
    chat.say("'config': lists your current bucket config")
  })


  eventEmitter.on('new', function(itemSlug, time) { // 1
    schedule.scheduleJob(time, function(){ // 2
      Cosmic.getObject(config, {slug: itemSlug}, function(error, response){ // 3
        if(response.object.metadata.date == new Date(time).toISOString()){ // 4
          bot.say(BotUserId, response.object.title) // 5
          console.log('firing reminder')
        } else {
          eventEmitter.emit('new', response.object.slug, response.object.metafield.date.value) // 6
          console.log('times do not match checking again at '+response.object.metadata.date)
        }
      })
    })
  })
  
  bot.start();