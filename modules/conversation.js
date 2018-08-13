'use strict';

const strings = require('../config/strings.json');
const format = require('string-format');

module.exports = (bot) => {

    // const buy = (convo) = {
    
    // };

    bot.on('postback:BUY_USD', (payload, chat) => {
        chat.say(`USD...`);
    });

    bot.on('postback:BUY_EUR', (payload, chat) => {
        chat.say(`EUR...`);
    });

    bot.on('postback:BUY_GPB', (payload, chat) => {
        chat.say(`GPB...`);
    });
};