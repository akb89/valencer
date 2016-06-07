"use strict";

const koa = require('koa');
const addToContext = require('koa-add-to-context')
var app = koa();
const winstonKoaLogger = require('winston-koa-logger');
const router = require('./routes');
const logger = require('./logger');

app.use(winstonKoaLogger(logger));
app.use(addToContext({valQuery : 'valQuery'})); // a custom query object 
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);