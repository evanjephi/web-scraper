const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

const MAX_RETRIES = 3;

// Scrape Amazon product titles, prices, and images
const scrapeAmazon = async (retries = 0) => {
    const url = 'https://www.amazon.com/s?k=electric+toothbrush&crid=TWVK2K0L1CL6&sprefix=elect%2Caps%2C101&ref=nb_sb_ss_ts-doa-p_ci_hl-bn-left_1_5';
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);
        let results = [];

        // Adjust selector to match Amazon's structure
        $('div.s-main-slot div.s-result-item').each((index, element) => {
            const title = $(element).find('h2.a-size-base-plus.a-spacing-none.a-color-base.a-text-normal span').text().trim();
            const price = $(element).find('span.a-price span.a-offscreen').first().text().trim();
            const image = $(element).find('img.s-image').attr('src');
            if (title && price && image) {
                console.log(`Amazon scraped title: ${title}, price: ${price}, image: ${image}`); // Log the title, price, and image
                results.push({ source: 'Amazon', title, price, image });
            }
        });

        if (results.length === 0) {
            console.log("No product titles, prices, or images found on Amazon.");
        }

        return results;
    } catch (error) {
        console.error('Error scraping Amazon:', error);
        if (retries < MAX_RETRIES) {
            console.log(`Retrying... (${retries + 1}/${MAX_RETRIES})`);
            return scrapeAmazon(retries + 1);
        } else {
            return [];
        }
    }
};

// Scrape Amazon and return results
app.get('/scrape', async (req, res) => {
    try {
        const amazonResults = await scrapeAmazon();

        console.log('Scraped data:', amazonResults); // Log the scraped data

        res.json({ success: true, data: amazonResults }); // Send back the results as JSON
    } catch (error) {
        console.error('Error scraping data:', error);
        res.status(500).json({ success: false, message: 'Error scraping data' });
    }
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
