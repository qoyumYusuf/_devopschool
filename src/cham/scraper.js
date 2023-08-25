import CSSStyleDeclarationLight from './cssstyledeclaration_light.js';
import scrape from 'website-scraper';
import cssjs from 'jotform-css.js';
import fs from 'fs';
import { parse } from 'node-html-parser';

const ScrapeWebsite = async (url) => {
  const pathDir = `./urlFolders/${url.replace(/[^a-zA-Z0-9]+/g, "")}`;
  let options = {
    urls: [url],
    directory: pathDir,
    sources: [
      { selector: 'link[rel="stylesheet"]', attr: 'href' },
    ],
  };

  const result = await scrape(options)
    .finally(() => {
      console.log("Website succesfully downloaded", url);
      console.log("Removing the downloaded files for unnecessity")
      fs.rmSync(pathDir, { recursive: true })
    })

  let plainCsses = ""
  result[0].children.map(resource => {
    if (resource.type == 'css') {
      plainCsses += resource.text;
    }
  })

  const parser = new cssjs.cssjs()
  const cssFromSite = parser.parseCSS(plainCsses)

  const htmlDoc = parse(result[0].text)

  // TODO: Refactor this.
  // LEGACY START
  var styles = new Object({
    header: {
      fontFamily: new Object(),
      fontSize: new Object(),
      fontWeight: new Object(),
      color: new Object(),
      background: new Object(),
      border: new Object(),
      padding: new Object()
    },
    text: {
      fontFamily: new Object(),
      fontSize: new Object(),
      fontWeight: new Object(),
      color: new Object(),
      background: new Object(),
      border: new Object(),
      padding: new Object()
    },
    button: {
      fontFamily: new Object(),
      fontSize: new Object(),
      fontWeight: new Object(),
      color: new Object(),
      background: new Object(),
      border: new Object(),
      padding: new Object()
    },
    input: {
      fontFamily: new Object(),
      fontSize: new Object(),
      fontWeight: new Object(),
      color: new Object(),
      background: new Object(),
      border: new Object(),
      padding: new Object()
    },
    div: {
      fontFamily: new Object(),
      fontSize: new Object(),
      fontWeight: new Object(),
      color: new Object(),
      background: new Object(),
      border: new Object(),
      padding: new Object()
    },
    fontFamilies: [],
    textPallet: [],
    backgroundPallet: []
  });

  var headers = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  var texts = ['p', 'span'];
  var buttons = ['button', 'a'];
  var inputs = ['input', 'select'];
  var divs = ['body', 'div', 'section'];
  var tags = headers.concat(texts, buttons, inputs, divs).join(',');
  var elements = htmlDoc.querySelectorAll(tags);
  var colorFilters = ['rgba(0, 0, 0, 0)', 'rgba(0%, 0%, 0%, 0%)', '#00000000', 'hsla(0, 0%, 0%, 0)', 'transparent'];

  elements.forEach(function(element) {
    let cssdoc = new CSSStyleDeclarationLight(cssFromSite)
    var tagName = element.tagName.toLocaleLowerCase();

    if (tags.includes(tagName)) {
      var tagType = "";
      if (headers.includes(tagName)) tagType = 'header';
      if (texts.includes(tagName)) tagType = 'text';
      if (buttons.includes(tagName)) tagType = 'button';
      if (inputs.includes(tagName)) tagType = 'input';
      if (divs.includes(tagName)) tagType = 'div';

      var computed = cssdoc.getComputedStyle(tagType, ...element.classList.value)

      var computedFont = computed['font-family'];
      var computedFontSize = computed['font-size'];
      var computedFontWeight = computed['font-weight'];
      var computedBorder = computed['border'];
      var computedPadding = computed['padding'];
      var computedColor = computed['color'];
      var computedBackground = computed['background-color'];

      if (buttons.includes(tagType)) {
        if (colorFilters.includes(computedBackground)) return;
      }

      var font = styles[tagType].fontFamily[computedFont];
      var fontSize = styles[tagType].fontSize[computedFontSize];
      var fontWeight = styles[tagType].fontWeight[computedFontWeight];
      var color = styles[tagType].color[computedColor];
      var background = styles[tagType].background[computedBackground];
      var border = styles[tagType].border[computedBorder];
      var padding = styles[tagType].padding[computedPadding];

      font === undefined ? styles[tagType].fontFamily[computedFont] = 1 : styles[tagType].fontFamily[computedFont] += 1;
      fontSize === undefined ? styles[tagType].fontSize[computedFontSize] = 1 : styles[tagType].fontSize[computedFontSize] += 1;
      fontWeight === undefined ? styles[tagType].fontWeight[computedFontWeight] = 1 : styles[tagType].fontWeight[computedFontWeight] += 1;
      border === undefined ? styles[tagType].border[computedBorder] = 1 : styles[tagType].border[computedBorder] += 1;
      padding === undefined ? styles[tagType].padding[computedPadding] = 1 : styles[tagType].padding[computedPadding] += 1;

      if (!colorFilters.includes(computedColor)) {
        color === undefined ? styles[tagType].color[computedColor] = 1 : styles[tagType].color[computedColor] += 1;
      }

      if (!colorFilters.includes(computedBackground)) {
        background === undefined ? styles[tagType].background[computedBackground] = 1 : styles[tagType].background[computedBackground] += 1;
      }
    }
  });

  var highestValue = function highestValue(obj) {
    var values = [];
    for (let k in obj) {
      values.push(k);
    }

    if (values.length === 0) {
      return '';
    } else {
      return values.reduce(function(a, b) {
        return obj[a] > obj[b] ? a : b;
      });
    }
  };

  var keysCollection = function keysCollection(collection, obj) {
    for (let k in obj) {
      if (!collection.includes(k)) collection.push(k);
    }

    return collection;
  };

  for (let style in styles) {
    styles.fontFamilies = keysCollection(styles.fontFamilies, styles[style].fontFamily);
    styles.textPallet = keysCollection(styles.textPallet, styles[style].color);
    styles.backgroundPallet = keysCollection(styles.backgroundPallet, styles[style].background);

    styles[style].fontFamily = highestValue(styles[style].fontFamily);
    styles[style].fontSize = highestValue(styles[style].fontSize);
    styles[style].fontWeight = highestValue(styles[style].fontWeight);
    styles[style].color = highestValue(styles[style].color) || 'rgba(0, 0, 0, 0)';
    styles[style].background = highestValue(styles[style].background) || 'rgba(0, 0, 0, 0)';
    styles[style].border = highestValue(styles[style].border);
    styles[style].padding = highestValue(styles[style].padding);
  }

  return styles
  // LEGACY END
}

export default ScrapeWebsite;
