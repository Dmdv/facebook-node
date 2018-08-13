'use strict';

const BootBot = require("bootbot");
const config = require("config");
const express = require('express');

const menuModule = require('./modules/main_menu');
const greetingModule = require('./modules/greeting');
const tunnelModule = require('./modules/tunnel');
const debugModule = require('./modules/debug');
const conversationModule = require('./modules/conversation');

if (config.get('debug') === true) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

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

const bot = new BootBot({
    accessToken: config.get('access_token'),
    verifyToken: config.get('verify_token'),
    appSecret: config.get('app_secret')
});

// Serve static files in images folder
bot.app.use(express.static(config.get('public_folder')));

// Load modules
{
    bot.module(greetingModule);
    bot.module(menuModule);

    if (config.get('debug') === true) {
        bot.module(debugModule);
    }

    bot.module(tunnelModule);
    bot.module(conversationModule);
}

console.log("Bot started");

bot.start(config.get('bot_port'));