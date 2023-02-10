const { idKey } = require('../src/constants');

const config = {
	type: 'entity',
	path: '/',
	idKey: 'refId',
	statusKey: '_status',
	parentKey: 'refId',
	disabled: true,
	mapping: {
		refId: 'id',
	},
	children: {
		customer: {
			type: 'entity',
			path: './customer',
			idKey: 'id',
			statusKey: '_status',
			mapping: {
				[idKey]: 'cId',
				age: {
					prop: 'years',
					in: (val) => val,
					out: (val) => val,
				},
			},
		},
	},
};

module.exports = config;
