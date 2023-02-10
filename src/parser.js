const typeProcessors = require('./typeProcessors');
const { result } = require('@laufire/utils/collection');
const { config: normalizeConfig } = require('./normalizer');

const parser = (context) => {
	const { source, config } = context;
	const normalizedConfig = normalizeConfig({ ...context, data: config });
	const { type, path } = normalizedConfig;

	return typeProcessors[type]({
		...context,
		typeProcessors: typeProcessors,
		data: {
			entityData: result(source, path),
			entityConfig: normalizedConfig,
		},
	});
};

module.exports = parser;
