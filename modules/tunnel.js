'use strict';

const format = require('string-format');
const localtunnel = require("localtunnel");
const config = require("config");

module.exports = (bot) => {

    // localtunnel

    console.log(format("Running localtunnel on domain: '{}'", config.get('subdomain')));

    const tunnel = localtunnel(config.get('bot_port'), {
        subdomain: config.get('subdomain')
    }, function (err, tunnel) {

        if (err) {
            console.warn("Failed to start localtunnel:");
            console.warn(err);
            return;
        }

        console.log(format('Localtunnel is started on: "{}"', tunnel.url));
    });

    tunnel.on('close', () => {
        console.warn("localtunnel is closed");
    });

};