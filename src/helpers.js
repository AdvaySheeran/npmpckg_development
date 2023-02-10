const { keys } = require('@laufire/utils/lib');
const {	shell, result } = require('@laufire/utils/collection');
const { parts } = require('@laufire/utils/path');

const helpers = {
	asyncMap: async (collection, cb) => {
		const ret = shell(collection);

		const collectionKeys = keys(collection);

		let i = 0;

		while(i < collectionKeys.length) {
			const key = collectionKeys[i];

			// eslint-disable-next-line no-await-in-loop
			ret[key] = await cb(
				collection[key], key, collection
			);
			i++;
		}

		return ret;
	},

	// Rename.
	createStructure: (context) => {
		const { data: { base, path, leaf }} = context;
		const pathParts = parts(path).slice(1);

		return pathParts.reduce((
			acc, part, i, coll
		) => {
			const parent = coll.slice(0, i).join('/');

			result(acc, parent)[part] = pathParts.length - 1 === i ? leaf : {};
			return acc;
		}, base);
	},
};

module.exports = helpers;
