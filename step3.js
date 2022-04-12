const fs = require('fs');
const process = require('process');
const axios = require('axios');

/** handle output: write to file if out given, else print */
function handleOutput(text, out) {
  if (out) {
    fs.writeFile(out, text, 'utf8', function (err) {
      if (err) {
        console.error(`Couldn't write ${out}: ${err}`);
        process.exit(1);
      }
    });
  } else {
    console.log(text);
  }
}

/** read file at path and print it out. */
function cat(path, out) {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      // handle possible error
      console.error(`Error reading ${path}: \n${err}`);
      // kill the process and tell the shell it errored
      process.exit(1);
    }
    // otherwise success
    handleOutput(data, out);
  });
}

/** read page at URL and print it out. */
async function webCat(url, out) {
  try {
    let resp = await axios.get(url);
    handleOutput(resp.data, out);
  } catch (err) {
    console.error(`Error fetching ${url}: ${err}`);
    process.exit(1);
  }
}

/** read variable arg and check to see if URL */

let path;
let out;

if (process.argv[2] === '--out') {
  out = process.argv[3];
  path = process.argv[4];
} else {
  path = process.argv[2];
}

if (path.startsWith('http')) {
  webCat(path, out);
} else {
  cat(path, out);
}
