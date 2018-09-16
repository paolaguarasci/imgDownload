const fs = require('fs');
const request = require('request');
const path = require("path");
const http = require('http');
const parse = require('parse5').parse;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const type = process.argv[2];
const input = process.argv[3];

// get page
request.get(input, (err, body) => {
    const html = body.body;
    const dom = new JSDOM(html);
    // get link
    const links = [...dom.window.document.querySelectorAll(type)];

    for (let i in links) {
        if (type === 'img') {
            links[i] = input + '/' + links[i].src;
        }
        if (type === 'a') links[i] = links[i].href;
    };
    get(links);
});

// download link
function get(links) {
    if (type != 'a') {
        for (let i in links) {
            let link = links[i];
            console.log(link);
            // request.get(link).pipe(fs.createWriteStream("img" + pad(i, 3) + ".jpeg"));
            request.get(link).pipe(fs.createWriteStream("alt." + path.parse(link).base));
        }
    } else {
        console.log(links)
    }
}


// Credit stackowerflow:
// https://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript#10073788
function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

