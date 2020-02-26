const puppeteer = require('puppeteer');
require('dotenv').config('./.env');

const username = process.env.username;
const password = process.env.password;
const url = process.env.url;

const btnAccessLoginPage = '.tdiEy button';
const usernameTextbox = 'input[name="username"]';
const passwordTextbox = 'input[name="password"]';
const btnLogin = 'button[type="submit"]';

async function scrollToTheEndOfPage() {
    let beforeScrollHeight = await new Promise((resolve, reject) => {
        resolve(document.querySelector('body').scrollHeight);
    })
    let scroll = await new Promise((resolve, reject) => {
        window.scrollBy(0, window.innerHeight * 3000);
        resolve('Done!');
    })
    await new Promise((resolve, reject) => {
        setTimeout(resolve, 2000);
    })
    let afterScrollHeight = await new Promise((resolve, reject) => {
        resolve(document.querySelector('body').scrollHeight);
    })
    if (beforeScrollHeight != afterScrollHeight) {
        scrollToTheEndOfPage();
    }
}

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url);

    await page.waitFor(btnAccessLoginPage);
    await page.$eval(btnAccessLoginPage, e => e.click());

    await page.waitFor(usernameTextbox);
    await page.type(usernameTextbox, username);
    await page.waitFor(passwordTextbox);
    await page.type(passwordTextbox, password);
    await page.waitFor(btnLogin);
    await page.$eval(btnLogin, e => e.click());
    await page.waitForNavigation({ waitUntil: 'load' });

    console.log('Waiting for loading all images......!');
    await page.evaluate(scrollToTheEndOfPage);

    //await browser.close();
})();