#!/usr/bin/env node
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import conf from '../next.config.js';

const dev = process.env.NODE_ENV !== 'production';
const port = 3000;

const app = next({
//	dir: __dirname + '/../',
	conf,
	dev,
});
const handle = app.getRequestHandler();

await app.prepare();

createServer((req, res) => {
	// Be sure to pass `true` as the second argument to `url.parse`.
	// This tells it to parse the query portion of the URL.
	const parsedUrl = parse(req.url, true);
	const { pathname, query } = parsedUrl;

	handle(req, res, parsedUrl);
}).listen(port, (err) => {
	if (err) throw err;
	console.log(`> Ready on http://localhost:${port}`);
});

