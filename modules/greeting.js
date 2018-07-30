'use strict';

const strings = require('../config/strings.json');
const format = require('string-format');

module.exports = (bot) => {

    // Приветствие и кнопка 'Начать'

    bot.setGreetingText(strings.greetingText);

    bot.setGetStartedButton((payload, chat) => {

        chat.say(strings.greetingMessage);

        console.warn(format("BotUserId = {}", payload.sender.id));
    });
};