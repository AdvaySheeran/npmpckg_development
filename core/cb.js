const { sleep, peek } = require('@laufire/utils/debug');
const apiData = require('../src/mocks');

const cb = async ({ entityName, action, data, parentId }) => {
	peek({ entityName, action, data, parentId });
	const duration = 2000;

	await sleep(duration);

	return apiData[entityName] || data;
};

module.exports = cb;
