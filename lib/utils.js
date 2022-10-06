const axios = require('axios');
const cheerio = require('cheerio');
const dayjs = require('dayjs');
const { slackBot } = require('./bots')

const getContentFromPage = async function (url) {
    let response = await axios.get(url);
    let $ = cheerio.load(response.data);
    let posts = $('body > main > div > section.wrapper-left > section > div.context-box__content.story-list__holder.story-list__holder--full').children();
    let date = dayjs().format('YYYY-MM-DD');
    let result = '';
    posts.each(function(i, element) {
        let text = $(element).text();
        if ((text.includes('今日星座運勢') || text.includes('每日星座運勢')) && text.includes(date)) {
            result = $(element).find('a').attr('href');
            return false;
        }
    });

    if (!result) {
        throw new Error(`Result empty from page. (URL: ${url})`);
    }

    var sendText = `${date}星座運勢\n${result}`;
    return sendText;
};

const getContentFromApi = async function (url) {
    let response = await axios.get(url);
    let posts = response.data.lists;
    let date = dayjs().format('YYYY-MM-DD');
    let result = '';
    posts.forEach(function(element, i) {
        let text = element.title;
        let datetime = element.time.date;
        if ((text.includes('今日星座運勢') || text.includes('每日星座運勢')) && datetime.includes(date)) {
            let link = element.titleLink;
            result = `https://udn.com${link.substring(0, link.indexOf('?'))}`;
            return false;
        }
    });

    if (!result) {
        throw new Error(`Result empty from api. (URL: ${url})`);
    }

    let sendText = `${date}星座運勢\n${result}`;
    return sendText;
};

const getSender = function () {
    let bot = new slackBot(process.env.SLACK_BOT_TOKEN);
    bot.channel = process.env.SLACK_CHANNEL_ID;
    return bot;
};

const sendMessage = async function (message) {
    let sender = getSender();
    try {
        let botResponse = await sender.send(message);

        console.info('Send success by ' + sender.constructor.name + ' : ');
        console.info(botResponse);
    } catch (err) {
        console.error(err);
        await sendError(err);
    }
};

const getErrorSender = function () {
    if (process.env.ERROR_SLACK_CHANNEL_ID) {
        let bot = new slackBot(process.env.SLACK_BOT_TOKEN);
        bot.channel = process.env.ERROR_SLACK_CHANNEL_ID;
        return bot;
    }
    console.warn('error channel not set');
};

const sendError = async function (err) {
    let sender = getErrorSender();
    if (!sender) {
        return;
    }

    try {
        let botResponse = await sender.send(err.stack);
    } catch (err2) {
        console.error('Send failed by ' + sender.constructor.name + ' : ');
        console.error(err2);
    }
};

module.exports = { getContentFromPage, getContentFromApi, sendMessage, sendError };
