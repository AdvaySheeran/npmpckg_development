const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./database.json');
const { peek } = require('@laufire/utils/debug');

require('dotenv').config();
const { env: { PORT }} = process;

server.use(router);
server.listen(PORT, () => peek(`JSON Server is running ${ PORT }`));
