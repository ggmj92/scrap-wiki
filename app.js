const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const async = require('async');

const app = express();
const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap';

app.get('/', (req, res) => {
    res.send('Welcome to the home page! Navigate to /scrape to start the scraping process.');
});

app.get('/scrape', async (req, res) => {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const linkElements = $('#mw-pages a');

    const scrapedData = [];

    const promises = Array.from(linkElements).map(async (element) => {
        pageUrl = $(element).attr('href');
        const response = await axios.get(`https://es.wikipedia.org${pageUrl}`);
        const $page = cheerio.load(response.data);
        const title = $('h1').text();
        const images = [];
        const texts = [];

        $('img').each((i, img) => images.push($(img).attr('src')));
        $('p').each((i, p) => texts.push($(p).text()));

        console.log(title, images, texts);

        scrapedData.push({ title, images, texts });
    }, (err) => {
        if (err) console.log(err);
        console.log(scrapedData);
        res.send(scrapedData);
    });
});

app.listen(3000, () => console.log('Server is running on port 3000'));