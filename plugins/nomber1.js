const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Initialize the Express app
const app = express();
const PORT = 4000;


// =================== API Endpoints ===================

// Function to scrape movie details from the main page
async function getMovieDetails(movieName) {
    const movieUrl = `https://firemovieshub.com/movies/${movieName}/`; // Adjust the URL if needed
    try {
        const response = await axios.get(movieUrl);
        const $ = cheerio.load(response.data);

        const title = $('title').text().trim();
        const description = $('meta[name="description"]').attr('content') || "Description not available";
        const quality = $('table th').first().next().text().trim();
        const releaseDate = $('div.release').text().trim() || 'Not Available';
        const rating = $('span.imdb-rating').text().trim() || $('span.valor strong').first().text().trim() || 'Not Available';
        const actors = [];

        // Scrape actors and director separately
        $('#cast .person').each((i, elem) => {
            const name = $(elem).find('meta[itemprop="name"]').attr('content');
            const role = $(elem).find('.caracter').text().trim();
            if (name && role) {
                actors.push({ name, role });
            }
        });

        const downloadLinks = [];
        // Extract all download links
        $('#download .links_table tbody tr').each((i, elem) => {
            const link = $(elem).find('a').attr('href');
            const qualityText = $(elem).find('td').eq(1).text().trim();
            const size = $(elem).find('td').eq(2).text().trim();

            if (link) {
                downloadLinks.push({ quality: qualityText, size: size, link: link });
            }
        });

        if (downloadLinks.length === 0) {
            return { error: 'No download links found for this movie.' };
        }

        return {
            title,
            description,
            link: movieUrl,
            img: $('meta[property="og:image"]').attr('content') || 'No image available',
            quality,
            actors,
            releaseDate,
            rating,
            downloadLinks
        };
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return { error: 'Failed to fetch movie details.' };
    }
}

// Function to get the final direct download link from the download page
async function getDirectDownloadLink(downloadLinkId) {
    const downloadLinkUrl = `https://firemovieshub.com/links/${downloadLinkId}/`;
    try {
        const response = await axios.get(downloadLinkUrl);
        const $ = cheerio.load(response.data);

        // Extract final direct download link from the page
        const finalDownloadLink = $('a#link').attr('href');

        if (!finalDownloadLink) {
            return { error: 'Direct download link not found.' };
        }

        return { directDownloadLink: finalDownloadLink };
    } catch (error) {
        console.error('Error fetching direct download link:', error);
        return { error: 'Failed to retrieve the direct download link.' };
    }
}

// Function to search for movies by keyword
async function searchMovies(query) {
    const searchUrl = `https://firemovieshub.com/?s=${query}`;
    try {
        const response = await axios.get(searchUrl);
        const $ = cheerio.load(response.data);
        const searchResults = [];

        $('.result-item').each((i, elem) => {
            const title = $(elem).find('.title a').text().trim();
            const link = $(elem).find('.title a').attr('href');
            const img = $(elem).find('img').attr('src');

            searchResults.push({ title, link, img });
        });

        if (searchResults.length === 0) {
            return { error: 'No movies found for this query.' };
        }

        return { searchResults };
    } catch (error) {
        console.error('Error searching movies:', error);
        return { error: 'Failed to fetch search results.' };
    }
}

// 1. Search Movies
app.get('/api/search', async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).json({ error: 'Search query is required.' });
    }

    const results = await searchMovies(query);
    res.status(results.error ? 500 : 200).json(results);
});

// 2. Get Movie Details
app.get('/api/movie', async (req, res) => {
    const movieName = req.query.name;
    if (!movieName) {
        return res.status(400).json({ error: 'Movie name is required.' });
    }

    const movieDetails = await getMovieDetails(movieName);
    res.status(movieDetails.error ? 500 : 200).json(movieDetails);
});

// 3. Get Direct Download Link
app.get('/api/download', async (req, res) => {
    const downloadLinkId = req.query.id;
    if (!downloadLinkId) {
        return res.status(400).json({ error: 'Download link ID is required.' });
    }

    const directLink = await getDirectDownloadLink(downloadLinkId);
    res.status(directLink.error ? 500 : 200).json(directLink);
});

// Start the server
app.listen(4000, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:4000');
});
