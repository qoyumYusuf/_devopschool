import express from 'express';
import url from 'url';
import ScrapeWebsite from './cham/scraper.js';
import { config } from 'dotenv';

config();

const app = express();
const port = process.env.PORT || 3010;

app.get("/api/styles", async (req, res) => {
  const reqUrl = req.url
  const parsedQuery = url.parse(reqUrl, true)
  const urlToScrap = parsedQuery.query.url

  if (!urlToScrap) {
    res.send({status: false, error: "Either bad url or not provided in body."});
    return;
  }

  const styles = await ScrapeWebsite(urlToScrap);

  res.send({success: true, styles: styles});
});

// start the Express server
console.log('PORT from .env:', port);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
