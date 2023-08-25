<img src="./Icon.png" width="128" style="border-radius: 16px;">

# POWR Chameleon

## Content
- [Purpose](#purpose)
- [How to install?](#how-to-install%20F)
    - [Prerequisites](#prerequisites)
- [Test the functinoality](#test-the-functionality)

## Purpose
To scrape the styles from provided URL.

> The main idea behind the chameleon, is to speed up the performance against of the current solution (AWS Lambda) that we (have|had) now.

## How to install?

### Prerequisites
1. NodeJS >= 20.0.0

<hr>

1. Clone this repository to your local directory `~/dev/`(https|ssh)
2. Run ```npm install```
3. Run the server ```npm start```

## Test the functionality

1. Open any browser
2. End-point to get the styles is `localhost:PORT/api/styles?url=YOUR_URL` // Put any url instead of the _YOUR_URL_
> Example: YOUR_URL: https://labotanicaplantmagic.com/
3. You whould expect JSON output
