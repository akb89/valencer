# winston-koa-logger

> [Winston](https://github.com/winstonjs/winston) middleware logger for [Koa](https://github.com/koajs/koa) based on [`express-winston`](https://github.com/bithavoc/express-winston).

# Instalation
    npm install winston-koa-logger

# Usage
You need to pass a instance of winston to middleware.

```js
const koa = require('koa');
const logger = require('./logger'); // Winston instance.
const winstonKoaLogger = require('winston-koa-logger');

const app = koa();

app.use(winstonKoaLogger(logger));

app.use(function *() {
  this.body = 'Hello World';
});

app.listen(3000);
```
