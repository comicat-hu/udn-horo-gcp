const functions = require('@google-cloud/functions-framework');
const { getContentFromPage, getContentFromApi, sendMessage, sendError } = require('./lib/utils')

exports.handler = (message, context) => {
    let contentFunctionCalls = [
        async function () {
            return await getContentFromPage('https://udn.com/search/tagging/2/%E6%AF%8F%E6%97%A5%E6%98%9F%E5%BA%A7%E9%81%8B%E5%8B%A2')
        },
        async function () {
            return await getContentFromPage('https://udn.com/search/tagging/2/%E6%98%9F%E5%BA%A7%E9%81%8B%E5%8B%A2')
        },
        async function () {
            return await getContentFromApi('https://udn.com/api/more?page=0&channelId=2&type=subcate_articles&cate_id=6649&sub_id=7268&totalRecNo=336&is_paywall=0&is_bauban=0&is_vision=0')
        },
    ];
    
    (async () => {
        for (let functionCall of contentFunctionCalls) {
            try {
                let message = await functionCall();
                await sendMessage(message);
                break;
            } catch (err) {
                await sendError(err);
            }
        }
    })();
};
