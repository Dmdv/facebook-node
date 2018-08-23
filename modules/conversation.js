'use strict';

const strings = require('../config/strings.json');
const format = require('string-format');

module.exports = (bot) => {

    const startTrading = (chat, currency) => {

        const askSum = (convo) => {

            convo.ask(`Введите сумму`, (payload, convo) => {
                const sum = payload.message.text;
                const operation = strings.operations[convo.get('operation').toLowerCase()]
                const currency = convo.get('currency').toLowerCase();

                convo.set('sum', sum);
                convo.say(`Вы хотите ${operation} ${sum} ${currency}`).then(() => showSettings(convo));
            });

        };

        const showSettings = (convo) => {
            convo.say("Показать настройки").then(() => convo.end());
        };

        const askOperation = (convo) => {

            // Пример использования callback
            // const callbacks = [
            //     {
            //         event: 'postback',
            //         callback: () => { 
            //             /* User said "black" or "white" */ 
            //             convo.say('fjhlkgklfdsgjfdk;j');
            //             console.log('fjhlkgklfdsgjfdk');
            //         }
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
                            title: 'Отмена операции',
                            payload: 'CANCEL'
                        }
                    ]
                },
                (payload, convo) => {

                    // Установить контекст
                    convo.set('operation', payload.postback.payload);
                    convo.set('currency',  currency);

                    if (payload.postback.payload === 'CANCEL') {
                        convo.say(strings.cancelText).then(() => convo.end());
                        return;
                    }

                    askSum(convo);

                } /*, callbacks*/ , options);
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