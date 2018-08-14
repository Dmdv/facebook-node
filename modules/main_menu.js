'use strict';

const config = require("config");
const strings = require('../config/strings.json');

const format = require('string-format');
const rates = require('./rates');

module.exports = (bot) => {

    // Persistent menu

    // Setting this to true would disable the text input on mobile
    // and the user will only be able to communicate via the persistent menu.
    const disableInput = true;

    // Главное меню

    bot.setPersistentMenu([{
            title: 'Купить',
            type: 'postback',
            payload: 'SELECT_CURRENCY'

            // Это вложенное меню для примера: убрать payload, type = 'nested' и раскомментировать
            // call_to_actions: [{
            //         title: 'Выберите валюту',
            //         type: 'postback',
            //         payload: 'SELECT_CURRENCY'
            //     }
            // ]
        },
        {
            title: 'Перейти на сайт',
            type: 'web_url',
            url: 'http://open.ru'
        },
        {
            title: 'О боте',
            type: 'postback',
            payload: 'ABOUT_BOT'
        },

    ], disableInput);

    // Обработчики меню

    bot.on('postback:ABOUT_BOT', (payload, chat) => {
        chat.say(`Contact info here...`);
    });

    bot.on('postback:SELECT_CURRENCY', (payload, chat) => {

        console.debug(strings.selectCurrencyText);

        rates.getRates().then(rates => {

            chat.say(rates);

            // Send a text message with buttons
            chat.say({
                text: strings.selectCurrencyText,
                buttons: [{
                        type: 'postback',
                        title: strings.usd,
                        payload: 'USD'
                    },
                    {
                        type: 'postback',
                        title: strings.eur,
                        payload: 'EUR'
                    },
                    {
                        type: 'postback',
                        title: strings.gbp,
                        payload: 'GPB'
                    }
                ]
            });

        });

    });

    // Пример создания списка
    // bot.on('postback:CURRENCY_LIST', (payload, chat) => {

    //     chat.say(`List here...`);

    //     chat.say({
    //         elements: [{
    //                 title: 'USD',
    //                 image_url: config.get('global_url') + 'usd.jpeg',
    //                 "buttons": [{
    //                     "title": "Купить",
    //                     "type": "web_url",
    //                     "url": "https://www.ya.ru",
    //                     "messenger_extensions": false,
    //                     "webview_height_ratio": "tall"
    //                 }],
    //                 "default_action": {
    //                     "type": "web_url",
    //                     "url": "https://peterssendreceiveapp.ngrok.io/view?item=100",
    //                     "messenger_extensions": false,
    //                     "webview_height_ratio": "tall"
    //                 }
    //             },
    //             {
    //                 title: 'EURO',
    //                 image_url: config.get('global_url') + 'euro.png',
    //                 "buttons": [{
    //                     "title": "Купить",
    //                     "type": "web_url",
    //                     "url": "https://www.ya.ru",
    //                     "messenger_extensions": false,
    //                     "webview_height_ratio": "tall"
    //                 }],
    //                 "default_action": {
    //                     "type": "web_url",
    //                     "url": "https://peterssendreceiveapp.ngrok.io/view?item=100",
    //                     "messenger_extensions": false,
    //                     "webview_height_ratio": "tall"
    //                 }
    //             },
    //             {
    //                 title: 'GBP',
    //                 image_url: config.get('global_url') + 'GBP.png',
    //                 "buttons": [{
    //                     "title": "Купить",
    //                     "type": "web_url",
    //                     "url": "https://www.ya.ru",
    //                     "messenger_extensions": false,
    //                     "webview_height_ratio": "tall"
    //                 }],
    //                 "default_action": {
    //                     "type": "web_url",
    //                     "url": "https://peterssendreceiveapp.ngrok.io/view?item=100",
    //                     "messenger_extensions": false,
    //                     "webview_height_ratio": "tall"
    //                 }
    //             }
    //         ],
    //         buttons: [{
    //             type: 'postback',
    //             title: 'View More',
    //             payload: 'VIEW_MORE'
    //         }]
    //     }, {
    //         topElementStyle: "compact"
    //     });

    // });
};