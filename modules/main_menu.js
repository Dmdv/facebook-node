'use strict';

const config = require("config");
const strings = require('../config/strings.json');

module.exports = (bot) => {

    // Persistent menu

    // Setting this to true would disable the text input on mobile
    // and the user will only be able to communicate via the persistent menu.
    const disableInput = true;

    bot.setPersistentMenu([{
            title: 'Валюта',
            type: 'nested',
            call_to_actions: [{
                    title: 'Курсы валют(кнопки)',
                    type: 'postback',
                    payload: 'CURRENCY_RATE'
                },
                {
                    title: 'Список валюты (список)',
                    type: 'postback',
                    payload: 'CURRENCY_LIST'
                },
                {
                    title: 'Оформить заказ (общий шаблон)',
                    type: 'postback',
                    payload: 'ORDER'
                }
            ]
        },
        {
            title: 'Go to Website',
            type: 'web_url',
            url: 'http://open.ru'
        },
        {
            title: 'О боте',
            type: 'postback',
            payload: 'ABOUT_BOT'
        },
        // {
        //   title: 'Обратная связь',
        //   type: 'postback',
        //   payload: 'ABOUT_BOT'
        // }
    ], disableInput);


    bot.on('postback:CURRENCY_LIST', (payload, chat) => {

        chat.say(`List here...`);

        chat.say({
            elements: [{
                    title: 'USD',
                    image_url: config.get('global_url') + 'usd.jpeg',
                    "buttons": [{
                        "title": "Купить",
                        "type": "web_url",
                        "url": "https://www.ya.ru",
                        "messenger_extensions": false,
                        "webview_height_ratio": "tall"
                    }],
                    "default_action": {
                        "type": "web_url",
                        "url": "https://peterssendreceiveapp.ngrok.io/view?item=100",
                        "messenger_extensions": false,
                        "webview_height_ratio": "tall"
                    }
                },
                {
                    title: 'EURO',
                    image_url: config.get('global_url') + 'euro.png',
                    "buttons": [{
                        "title": "Купить",
                        "type": "web_url",
                        "url": "https://www.ya.ru",
                        "messenger_extensions": false,
                        "webview_height_ratio": "tall"
                    }],
                    "default_action": {
                        "type": "web_url",
                        "url": "https://peterssendreceiveapp.ngrok.io/view?item=100",
                        "messenger_extensions": false,
                        "webview_height_ratio": "tall"
                    }
                },
                {
                    title: 'GBP',
                    image_url: config.get('global_url') + 'GBP.png',
                    "buttons": [{
                        "title": "Купить",
                        "type": "web_url",
                        "url": "https://www.ya.ru",
                        "messenger_extensions": false,
                        "webview_height_ratio": "tall"
                    }],
                    "default_action": {
                        "type": "web_url",
                        "url": "https://peterssendreceiveapp.ngrok.io/view?item=100",
                        "messenger_extensions": false,
                        "webview_height_ratio": "tall"
                    }
                }
            ],
            buttons: [{
                type: 'postback',
                title: 'View More',
                payload: 'VIEW_MORE'
            }]
        }, {
            topElementStyle: "compact"
        });

    });

    bot.on('postback:ORDER', (payload, chat) => {
        chat.say(`Create order...`);
    });

    bot.on('postback:ABOUT_BOT', (payload, chat) => {
        chat.say(`Contact info here...`);
    });

    bot.on('postback:CURRENCY_RATE', (payload, chat) => {

        console.debug(strings.selectCurrencyText);

        // Send a text message with buttons
        chat.say({
            text: strings.selectCurrencyText,
            buttons: [{
                    type: 'postback',
                    title: strings.usd,
                    payload: 'BUY_USD'
                },
                {
                    type: 'postback',
                    title: strings.eur,
                    payload: 'BUY_EUR'
                },
                {
                    type: 'postback',
                    title: strings.gbp,
                    payload: 'BUY_GPB'
                }
            ]
        });
    });
};