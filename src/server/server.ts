import express from "express";
import fs from "fs";
import cors from "cors";
import { JSDOM } from "jsdom";

const app = express();

const options: cors.CorsOptions = {
  origin: ['http://127.0.0.1:5173','http://localhost:5173']
}

app.use(cors(options));

app.use(express.json());

app.get('/', (_, res) => {
  res.send('Hello World!')
})

app.get('/files', (_, res) => {
  const soundDirectory = 'public/sounds';

  fs.readdir(soundDirectory, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json({ files });
    }
  });
});

app.post('/search', async (req, res) => {
  try {
    const searchTerm = req.body.search;

    if (!searchTerm) {
      return res.status(400).json({ error: 'Missing search term in request body' });
    }

    const url = `https://www.myinstants.com/en/search/?name=${encodeURIComponent(searchTerm)}`;
    const response = await fetch(url);

    const data = await response.text();

    const dom = new JSDOM(data);
    const document = dom.window.document;
    const container = document.querySelector("#instants_container");
    const results = Array.from(container!.querySelectorAll(".instant"));
    const output = results.map((result) => {
      const mp3UrlElement = result.querySelector('button.small-button')!;
      const mp3Url = mp3UrlElement.getAttribute('onclick')!.match(/play\('([^']+)'/)![1];

      const titleElement = result.querySelector('a.instant-link')!;
      const title = titleElement!.textContent!.trim();

      return {
        name: title,
        url: `https://www.myinstants.com${mp3Url}`,
      }
    });

    res.status(200).send(output);
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3000, () => {
  console.log(`Soundboard app listening on port 3000`)
})