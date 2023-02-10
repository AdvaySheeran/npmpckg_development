const { find, contains } = require('@laufire/utils/collection');
const rules = require('./rules');

const throwError = () => {
	throw new Error('Error');
};

const getAction = (context) => {
	const { data } = context;

	const { action } = find(rules, ({ action: dummy, ...rule }) =>
		contains(data, rule));

	action === 'error' && throwError();

	return action;
};

module.exports = getAction;
