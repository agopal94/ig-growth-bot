const puppeteer = require('puppeteer');
const pino = require('pino');
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const BASE_URL = 'https://www.instagram.com/';

const instagram = {
    browser: null,
    page: null,
    page2: null,

    initialize: async () => {
        instagram.browser = await puppeteer.launch({ headless: true });
        instagram.page = await instagram.browser.newPage();
        await instagram.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36');
        await instagram.page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    },

    login: async (userId, password) => {
        try {
            await instagram.page.goto(BASE_URL, { waitUntil: 'networkidle2' });
            await instagram.page.type('input[name=username]', userId, { delay: 20 });
            await instagram.page.type('input[name=password]', password, { delay: 20 });
            await instagram.page.click('button[type="submit"]');
            await instagram.page.waitForTimeout(10000);
        }
        catch (err) {
            logger.error('Error in Instagram.Login:: ' + err);
        }
    },

    openHashTagPage: async (hashTag, noOfPostsToLike) => {
        try {
            logger.info('Start Instagram.openHashTagPage:: ' + hashTag);
            instagram.page2 = await instagram.browser.newPage();
            await instagram.page2.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36');
            await instagram.page2.goto('https://www.instagram.com/explore/tags/' + hashTag + '/', { waitUntil: 'networkidle2' });
            await instagram.page2.waitForTimeout(5000);
            let posts = await instagram.page2.$$('article > div:nth-child(3) img');
            for (let i = 0; i < noOfPostsToLike; i++) {
                let post = posts[i];
                logger.info('Opening Post ' + i);
                await post.click();
                await instagram.page2.waitForTimeout(5000);

                const likeable = await instagram.page2.$('span > svg[aria-label="Like"]');
                if (likeable) {
                    const like_node = await likeable.getProperty('parentNode');
                    if (like_node) {
                        await like_node.click();
                        logger.info('Liked Post ' + i);
                    }
                    await instagram.page2.waitForTimeout(2000);
                } else {
                    logger.info('Unable to Like Post ' + i);
                }

                const closeable = await instagram.page2.$('div > svg[aria-label="Close"]');
                if (closeable) {
                    const close_node = await closeable.getProperty('parentNode');
                    await close_node.click();
                }

            }
            await instagram.page2.close();
            logger.info('End Instagram.openHashTagPage:: ' + hashTag);
        }
        catch (err) {
            logger.error('Error in Instagram.openHashTagPage:: ' + err);
        }
    },

    close: async () => {
        logger.info('End Instagram.close ');
        await instagram.browser.close();
    }

}

module.exports = instagram;
