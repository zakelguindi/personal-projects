const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function uploadToTikTok(videoPath, caption, hashtags) {
    const browser = await puppeteer.launch({
        headless: false, // Set to true in production
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        
        // Load TikTok login page
        await page.goto('https://www.tiktok.com/login', {
            waitUntil: 'networkidle0'
        });

        // Wait for login form and input credentials
        await page.waitForSelector('input[name="username"]');
        await page.type('input[name="username"]', process.env.TIKTOK_USERNAME);
        await page.type('input[name="password"]', process.env.TIKTOK_PASSWORD);

        // Click login button
        await page.click('button[type="submit"]');

        // Wait for login to complete
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        // Go to upload page
        await page.goto('https://www.tiktok.com/upload?lang=en', {
            waitUntil: 'networkidle0'
        });

        // Wait for file input and upload video
        const fileInput = await page.$('input[type="file"]');
        await fileInput.uploadFile(videoPath);

        // Wait for video to process
        await page.waitForSelector('.video-preview', { timeout: 60000 });

        // Input caption and hashtags
        const captionInput = await page.$('.caption-input');
        await captionInput.type(`${caption}\n\n${hashtags.join(' ')}`);

        // Click post button
        await page.click('button[type="submit"]');

        // Wait for upload to complete
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        console.log('Video uploaded successfully!');
        return true;

    } catch (error) {
        console.error('Error uploading to TikTok:', error);
        return false;
    } finally {
        await browser.close();
    }
}

// Example usage
if (require.main === module) {
    const videoPath = process.argv[2];
    const caption = process.argv[3];
    const hashtags = process.argv[4].split(',');

    if (!videoPath || !caption || !hashtags) {
        console.error('Usage: node upload_tiktok.js <video_path> <caption> <hashtags>');
        process.exit(1);
    }

    uploadToTikTok(videoPath, caption, hashtags)
        .then(success => {
            if (!success) {
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('Fatal error:', error);
            process.exit(1);
        });
}

module.exports = uploadToTikTok; 