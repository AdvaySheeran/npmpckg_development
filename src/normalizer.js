const { map } = require('@laufire/utils/collection');
const { identity } = require('@laufire/utils/fn');
const { isIterable } = require('@laufire/utils/reflection');

const normalizers = {
	config: (context) => {
		const { data: config } = context;
		const { children = {}, mapping } = config;

		return {
			disabled: false,
			...config,
			mapping: map(mapping, (val) => (isIterable(val)
				? val
				: { path: val, in: identity, out: identity })),
			children: map(children, (childConfig) =>
				normalizers.config({ ...context, data: childConfig })),
		};
	},
};

module.exports = normalizers;
