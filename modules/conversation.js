'use strict';

const strings = require('../config/strings.json');
const format = require('string-format');

module.exports = (bot) => {

    const startTrading = (chat, currency) => {

        const askOperation = (convo) => {

            // const callbacks = [
            //     {
            //         pattern: ['black', 'white'],
            //         callback: () => { /* User said "black" or "white" */ }
            //     }
            // ];

            const options = {
                typing: true
            };

            convo.ask({
                text: `Выберите тип операции`,
                buttons: [{
                        type: 'postback',
                        title: 'Купить',
                        payload: 'BUY'
                    },
                    {
                        type: 'postback',
                        title: 'Продать',
                        payload: 'SELL'
                    },
                    {
                        type: 'postback',
                        title: 'Отменить',
                        payload: 'CANCEL'
                    }
                ]
            },(payload, convo) => {

                const text = payload.message.text;

                convo.set('operation', text);

                convo.say(`Тип операции: ${text}`);

                console.log('User selected: ' + `${text}`);

            }, /*callbacks, */ options);
        };

        chat.say('User selected: ' + currency);

        chat.conversation((convo) => {
            askOperation(convo);
        });
    };

    bot.on('postback:USD', (payload, chat) => {
        startTrading(chat, 'USD');
    });

    bot.on('postback:EUR', (payload, chat) => {
        startTrading(chat, 'EUR');
    });

    bot.on('postback:GPB', (payload, chat) => {
        startTrading(chat, 'GPB');
    });
};