const source = require('./core/structure');
const config = require('./core/config');
const cb = require('./core/cb');
const parser = require('./parser');
const typeProcessors = require('./src/typeProcessors');

parser({
	source,
	config,
	cb,
	typeProcessors,
});
