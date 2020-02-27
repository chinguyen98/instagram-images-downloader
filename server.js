const puppeteer = require('puppeteer');
const imageDownloader = require('image-downloader');
require('dotenv').config('./.env');

const username = process.env.username;
const password = process.env.password;
const url = process.env.url;

const btnAccessLoginPage = '.tdiEy button';
const usernameTextbox = 'input[name="username"]';
const passwordTextbox = 'input[name="password"]';
const btnLogin = 'button[type="submit"]';

function getImageUrl() {
    const imageLinks = Array.from(document.querySelectorAll('.KL4Bh img'));
    let images = imageLinks.map(image => ({
        'url': image.getAttribute('src')
    }));
    return images;
}

async function getImageUrlList(page, getImageUrl, imageTargetCount, scrollDelay = 1000) {
    let items = [];
    try {
        let previousHeight;
        while (items.length < imageTargetCount) {
            const images = await page.evaluate(getImageUrl);
            items.push(...images);
            previousHeight = await page.evaluate('document.body.scrollHeight');
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
            await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
            await page.waitFor(scrollDelay);
        }
    } catch (error) {

    }
    return items;
}

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    try {
        const page = await browser.newPage();
        await page.goto(url);

        console.log('\nAccess to Instagram......................');
        await page.waitFor(btnAccessLoginPage);
        await page.$eval(btnAccessLoginPage, e => e.click());

        await page.waitFor(usernameTextbox);
        await page.type(usernameTextbox, username);
        await page.waitFor(passwordTextbox);
        await page.type(passwordTextbox, password);
        await page.waitFor(btnLogin);
        await page.$eval(btnLogin, e => e.click());
        await page.waitForNavigation({ waitUntil: 'load' });

        console.log('\nCrawling......................');
        const images = await getImageUrlList(page, getImageUrl, 500);

        console.log('\nDownloading......................');
        await Promise.all(images.map(image => {
            imageDownloader.image({
                url: image.url,
                dest: `./images`
            })
        }));

    } catch (error) {
        console.log('Error! End!');
        await browser.close();
    }

    await browser.close();
})();