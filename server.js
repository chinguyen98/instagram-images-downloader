const puppeteer = require('puppeteer');
const imageDownloader = require('image-downloader');
require('dotenv').config('./.env');

const username = process.env.username;
const password = process.env.password;
const url = process.env.url;
const runningTime = 30000;

const btnAccessLoginPage = '.tdiEy button';
const usernameTextbox = 'input[name="username"]';
const passwordTextbox = 'input[name="password"]';
const btnLogin = 'button[type="submit"]';

async function scrollToTheEndOfPage() {
    try {
        let beforeScrollHeight = await new Promise((resolve, reject) => {
            resolve(document.querySelector('body').scrollHeight);
        })
        await new Promise((resolve, reject) => {
            window.scrollBy(0, window.innerHeight * 3000);
            resolve('Done!');
        })
        await new Promise((resolve, reject) => {
            setTimeout(resolve, 2000);
        })
        let afterScrollHeight = await new Promise((resolve, reject) => {
            resolve(document.querySelector('body').scrollHeight);
        })
        await new Promise((resolve, reject) => {
            if (beforeScrollHeight != afterScrollHeight) {
                scrollToTheEndOfPage();
                resolve('Done!');
            }
        })
    } catch (error) {

    }
}

async function getImgJson() {
    try {
        const imageLinks = await new Promise((resolve, reject) => {
            resolve(Array.from(document.querySelectorAll('.KL4Bh img')));
        })
        const images = await new Promise((resolve, reject) => {
            resolve(
                imageLinks.map(image => ({
                    'url': image.getAttribute('src')
                }))
            )
        });
        return images;
    } catch (error) {

    }
}

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    try {
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

        await new Promise((resolve, reject) => {
            setTimeout(resolve, runningTime);
        })

        const images = await page.evaluate(getImgJson);
        console.log(images);

        await Promise.all(images.map(image => {
            imageDownloader.image({
                url: image.url,
                dest: `./images`
            })
        }))
    } catch (error) {
        console.log('Error! End!')
        await browser.close();
    }

    console.log('Complete!');
    await browser.close();
})();