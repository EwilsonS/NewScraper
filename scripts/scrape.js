const request = require("request");
const cheerio = require("cheerio");

const scrape = function (cb) {

  request("https://www.theonion.com/", (error, response, html) => {

    const cc = cheerio.load(html);

    cc(".post-wrapper").each((i, element) => {

      const results = {}
      // magic object notation to dry up code. Same as `var key = cc(element).find("p")...` and pushing into array
      results.headline = cc(element).find(".headline").text().trim();
      results.summary = cc(element).find("p").text();
      results.URL = cc(element).find(".js_entry-link").attr("href");
      results.image = cc(element).find("source").attr("data-srcset");
    });
    cb(results)
  });
}

module.exports = scrape;