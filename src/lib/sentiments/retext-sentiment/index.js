import vfile from 'vfile';
import unified from 'unified';
import english from 'retext-english';
import stringify from 'retext-stringify';
import profanities from 'retext-profanities';
import sentiment from 'retext-sentiment';
import _ from 'lodash';

let scores = [];
let words = [];
let negativeWords = [];
let positiveWords = [];

function traverseTree(tree) {
  // go through all layers until reach a TextNode or SymbolNode with data
  if((tree.type === 'TextNode' || tree.type === 'SymbolNode')) {
    // check if the node has a score data
    if(!_.isUndefined(tree.data)) {
      scores.push(tree.data.polarity);
      if(tree.data.polarity > 0) {
        positiveWords.push(tree.value);
      } else if(tree.data.polarity < 0) {
        negativeWords.push(tree.value);
      }
    }

    words.push(tree.value);
    return;
  }

  // it's the end of the tree if there's no more children
  if(typeof tree.children === 'undefined') {
    return;
  }

  // look for words and symboles in all children nodes
  tree.children.forEach(traverseTree);
}

function calculateScores(scores) {
  return {
    minScore: (scores.length ? _.min(scores) : 0),
    maxScore: (scores.length ? _.max(scores) : 0),
    meanScore: (scores.length ? _.mean(scores) : 0),
    score: (scores.length ? _.sum(_.filter(scores, score => score < 0)) / words.length : 0),
  };
}

function reset() {
  scores = [];
  words = [];
  negativeWords = [];
  positiveWords = [];
}

export default function analyze(text) {
  return new Promise((resolve) => {
    reset();
    let file = vfile(text);
    let processor = unified()
      .use(english)
      .use(sentiment);
    let tree = processor.parse(file);
    processor.run(tree, file);
    traverseTree(tree);
    let calculatedScores = calculateScores(scores);
    resolve({
      // score is -6 to 6 so devide by 6 to clamp to -1 to 1
      range: calculatedScores.score / 6,
      details: {
        minScore: calculatedScores.minScore,
        maxScore: calculatedScores.maxScore,
        meanScore: calculatedScores.meanScore,
        negativeWords,
        positiveWords
      }
    });
  })
}
