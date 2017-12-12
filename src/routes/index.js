import path from 'path';
import KoaRouter from 'koa-router';
import analyzer from './analyzer';

const router = new KoaRouter();

router.use(analyzer.routes(), analyzer.allowedMethods());

export default router;
