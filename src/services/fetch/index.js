/* eslint-disable max-lines-per-function */
const {
	buildCbContext,	buildContext,	encodeData,
} = require('../index');
const { asyncMap } = require('../../helpers');
const { decodeDbData, mergeDbData } = require('./fetchManager');

const fetch = async (context) => {
	const { typeProcessors, data, cb } = context;
	const { entityData, entityConfig, currentAction } = data;
	const { children, idKey } = entityConfig;
	const parentAction = currentAction;

	await asyncMap(children, async (childConfig, entityName) => {
		const { type } = childConfig;
		const encodedData = encodeData(context);
		const dbData = await cb(buildCbContext({
			...context,
			parentId: entityData[idKey],
			data: {
				action: currentAction,
				encodedData: encodedData,
				entityName: entityName,
				entityConfig: childConfig,
			},
		}));

		mergeDbData(decodeDbData({
			dbData: dbData,
			entityData: entityData,
			entityConfig: childConfig,
		}));

		await typeProcessors[type](buildContext({
			...context,
			data: {
				...data,
				childConfig,
				entityName,
				parentAction,
			},
		}));
	});
};

module.exports = fetch;
