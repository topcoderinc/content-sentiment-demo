import Promise from 'bluebird';
import KoaRouter from 'koa-router';
import Boom from 'boom';
import { isEmpty } from 'lodash';
import sentimentNode from 'lib/sentiments/node';
import sentimentReText from 'lib/sentiments/retext-sentiment';
import profanityReText from 'lib/profanity/retext-profanities';

const router = new KoaRouter();

function validateAndFormatQuery(query) {
  if (!isEmpty(query.text)) {
    return { text: query.text };
  }

  throw Boom.badRequest('A `text` parameter must be provided.');
}

router.get('/analyze', async (ctx) => {
  const query = validateAndFormatQuery(ctx.query);
  ctx.body = await Promise.props({
    sentiment: Promise.props({
      node: sentimentNode(query.text),
      reText: sentimentReText(query.text),
    }),
    profanity: Promise.props({
      reText: profanityReText(query.text),
    }),
  });
});

export default router;
