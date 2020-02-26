const puppeteer = require('puppeteer');
require('dotenv').config('./.env');

const username = process.env.username;
const password = process.env.password;
const url = process.env.url;

const btnAccessLoginPage = '.tdiEy button';
const usernameTextbox = 'input[name="username"]';
const passwordTextbox = 'input[name="password"]';
const btnLogin = 'button[type="submit"]';

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

    //await browser.close();
})();