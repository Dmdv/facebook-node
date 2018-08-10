'use strict';

const strings = require('../config/strings.json');
const format = require('string-format');

module.exports = (bot) => {

    bot.on('message', (payload, chat) => {
        console.log("--- debug ---");
        const text = payload.message.text;
        console.log(text);
      });
};