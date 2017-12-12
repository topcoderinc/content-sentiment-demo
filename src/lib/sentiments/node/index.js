let sentiment = require('sentiment');

export default function analyze(text) {
  return new Promise((resolve) => {
    let result = sentiment(text);
    resolve({
      range: result.comparative,
      details: {
        negativeWords: result.negative,
        positiveWords: result.positive,
        score: result.score
      }
    });
  });
}
