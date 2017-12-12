import errorHandler from 'koa-better-error-handler';

// custom error handler (adds JSON error codes to body)
export default function (app) {
  app.context.onerror = errorHandler;
  // api = true returns non-html error message
  app.context.api = true;
  // handles custom 404 error, and emits errors to app
  app.use(async (ctx, next) => {
    try {
      await next();
      if (ctx.status === 404) ctx.throw(404);
    } catch (err) {
      ctx.throw(err);
      ctx.app.emit('error', err, ctx);
    }
  });
}
