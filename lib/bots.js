// var slack = require('slack');
const { WebClient } = require('@slack/web-api');

const slackBot = function (token) {
    let bot = new WebClient(token);

    this.channel = '';
    this.unfurl_links = true;

    this.send = async function (text) { 
        let botResponse = await bot.chat.postMessage({
            channel: this.channel,
            text,
            unfurl_links: this.unfurl_links,
        });
        return botResponse;
    }

    this.delete = async function (ts) {
        let botResponse = await bot.chat.delete({
            channel: this.channel,
            ts
        });
        return botResponse;
    }
}

module.exports = { slackBot };
