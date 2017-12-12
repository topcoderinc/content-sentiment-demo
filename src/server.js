/* eslint no-console: off */
import Koa from 'koa';
import json from 'koa-json';
import logger from 'koa-logger';
import router from 'routes';
import customErrorHandler from 'lib/customErrorHandler';
import { server } from 'config';
import serve from 'koa-static';


const app = new Koa();

customErrorHandler(app);

app.use(logger());
app.use(json({ pretty: false, param: 'pretty' }));

// Serve static files
app.use(serve(__dirname + '/static'));

// add routes, and have allowedMethods throw error so that
// customErrorHandler can display the errors, instead
// of a plain koa error message
app.use(router.routes());
app.use(router.allowedMethods({ throw: true }));

// start listening to port
app.listen(server.port);

console.log(`Listening on http://0.0.0.0:${server.port}`);

// Promose.all(
//   sentimentAnalyzers.run(),
//   profanityAnalyzers.run()
// )
