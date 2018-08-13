const axios = require('axios');
const config = require("config");
const format = require('string-format');

// takes a number i.e. 3456 and returns 34.56
const getRate = function (digits) {
    const value = digits.toString();
    return value.slice(0, -2) + '.' + value.slice(-2);
};

const getRates = function () {

    return new Promise(function (resolve, reject) {

        axios
            .get(config.get("rates_url"))
            .then(response => {
                const data = response.data;

                let msg = 'Продажа валюты банком:\n';
                msg += format("USD: {0}\n", getRate(data.rates.usd.buy));
                msg += format("EUR: {0}\n", getRate(data.rates.eur.buy));
                msg += format("GBP: {0}\n", getRate(data.rates.gbp.buy));

                msg += '\nПокупка валюты банком:\n';
                msg += format("USD: {0}\n", getRate(data.rates.usd.sell));
                msg += format("EUR: {0}\n", getRate(data.rates.eur.sell));
                msg += format("GBP: {0}\n", getRate(data.rates.gbp.sell));

                msg += '\nКурс обновляется каждые 5 минут';

                console.log(msg);
                console.log("Rates has been read successfully");

                resolve(msg);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });

    });
};

module.exports.getRates = getRates;