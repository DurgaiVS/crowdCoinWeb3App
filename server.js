import { createServer } from 'http';
import next from 'next';
import routes from './routes.cjs';

const app = next({
    dev: process.env.NODE_ENV !== 'production'
});

const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
    createServer(handler).listen(3000, (e) => {
        if(e) throw e;
        console.log('Listening on 3000');
    });
});