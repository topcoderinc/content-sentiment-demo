let unified = require('unified');
let english = require('retext-english');
let stringify = require('retext-stringify');
let profanities = require('retext-profanities');
let _ = require('lodash');

function getWords(file) {
  return _.uniq(file.messages.map(message => _.toLower(message.actual)));
}

function cleanText(text, words) {
  words.forEach((word) => {
    let regex = new RegExp(word + " ?", 'ig');
    text = text.replace(regex, '');
  });
  return _.trim(text);
}

export default function analyze(text) {
  return new Promise((resolve, reject) => {
    unified()
      .use(english)
      .use(profanities)
      .use(stringify)
      .process(text, function (err, file) {
        if(err) return reject(err);
        let words = getWords(file);
        resolve({
          isProfane: words.length > 0,
          clean: cleanText(text, words),
          words,
        });
      });
  });
}
