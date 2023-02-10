const {
	keys, map, omit,
	merge,
} = require('@laufire/utils/collection');
const {	decodeData } = require('../index');
const { createStructure } = require('../../helpers');

const types = {
	entity: (coll) => coll[0],
	collection: (coll) => coll,
};

const fetchManager = {
	decodeDbData: (context) => {
		const { dbData, entityConfig } = context;
		const { mapping } = entityConfig;

		return {
			...context,
			decodedData: map(dbData, (item) => ({
				...omit(item, keys(mapping)),
				...decodeData({
					...context,
					data: {
						entityConfig: entityConfig,
						entityData: {},
						dbData: item,
					},
				}),
			})),
		};
	},

	mergeDbData: (context) => {
		const { entityData, decodedData, entityConfig } = context;
		const { type, path } = entityConfig;

		merge(entityData, createStructure({
			...context,
			data: {
				base: {},
				path: path,
				leaf: types[type](decodedData),
			},
		}));
	},
};

module.exports = fetchManager;
