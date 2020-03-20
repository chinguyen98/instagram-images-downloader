const puppeteer = require('puppeteer');
const imageDownloader = require('image-downloader');

const url = 'instagram url';

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

        console.log('\nAccess to Instagram......................');
        await page.goto(url);

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