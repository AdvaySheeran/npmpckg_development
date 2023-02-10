const {
	map, result, clean,
	merge, reduce,	find,
	contains, findKey, values,
} = require('@laufire/utils/collection');
const { isDefined } = require('@laufire/utils/reflection');
const { createStructure } = require('../helpers');

const adjacentActions = [
	{
		previousStatus: 'create',
		currentStatus: 'delete',
	},
	{
		previousStatus: 'create',
		currentStatus: 'update',
	},
	{
		previousStatus: 'create',
		currentStatus: 'fetch',
	},
	{
		previousStatus: 'update',
		currentStatus: 'fetch',
	},
	{
		previousStatus: 'update',
		currentStatus: 'delete',
	},
	{
		previousStatus: 'fetch',
		currentStatus: 'delete',
	},
	{
		previousStatus: 'fetch',
		currentStatus: 'update',
	},
	{
		previousStatus: 'fetch',
		currentStatus: 'fetch',
	},
	{
		previousStatus: undefined,
		currentStatus: 'update',
	},
	{
		previousStatus: undefined,
		currentStatus: 'delete',
	},
	{
		previousStatus: undefined,
		currentStatus: 'fetch',
	},
];

const types = {
	sync: () => ({
		history: [],
		currentStatus: 'sync',
	}),
	deleted: () => ({
		history: [],
		currentStatus: 'deleted',
	}),
	exsistingAction: (context) => {
		const { data: { entityData }} = context;

		return {
			history: entityData._statusDetails.history,
			currentStatus: 'pending',
		};
	},
	fetch: () => ({
		history: ['fetch'],
		currentStatus: 'pending',
	}),
	currentAction: (context) => {
		const { data: { entityData, entityConfig }} = context;
		const { statusKey } = entityConfig;

		return {
			history: [entityData[statusKey]],
			currentStatus: 'pending',
		};
	},
};

const entityTypes = {
	sync: {
		entityStatus: 'sync',
		hasAction: false,
	},
	deleted: {
		entityStatus: 'deleted',
		hasAction: false,
	},
	exsistingAction: {
		hasAction: true,
	},
	fetch: {
		entityStatus: undefined,
		hasAction: false,
	},
	currentAction: {
		hasAction: false,
	},
};

const services = {
	addFetchStatus: (context) => {
		const { data: { entityData }} = context;
		const { config: { statusKey }} = context;

		map(entityData, (ele) => (ele[statusKey] = 'fetch'));
	},

	buildContext: (context) => {
		const { data: { entityConfig: { idKey }}, data } = context;
		const { entityData, parentAction, childConfig, entityName } = data;
		const { path, parentKey } = childConfig;

		return {
			...context,
			data: {
				entityName: entityName,
				entityData: result(entityData, path),
				entityConfig: childConfig,
				parentAction: parentAction,
				parentKey: parentKey,
			},
			parentId: entityData[idKey],
		};
	},

	buildCbContext: (context) => {
		const { parentId, data } = context;
		const { entityConfig, encodedData, entityName, action } = data;
		const { parentKey } = entityConfig;

		return {
			...context,
			action: action,
			entityName: entityName,
			data: clean({
				...parentKey && { [parentKey]: parentId },
				...encodedData,
			}),
			...parentKey && { parentKey },
		};
	},

	// TODO: Breaking single responsibility principle
	// TODO: processing cb, decoding, merging are separate actions.
	// eslint-disable-next-line max-lines-per-function
	processCallBack: async (context) => {
		const {	data: { entityData },	data,	cb } = context;
		const { entityConfig: { mapping }, currentAction: action } = data;

		const encodedData = services.encodeData(context);

		try {
			const dbData = await cb(services.buildCbContext({
				...context,
				data: {
					...data,
					encodedData,
					action,
				},
			}));

			const decodedData = services.decodeData({ ...context,
				data: { ...data, dbData, action }});

			const decodedEntity = merge(
				{}, decodedData, entityData
			);

			map(mapping, (dummy, prop) =>
				(entityData[prop] = decodedEntity[prop]));

			entityData._statusDetails.isError = false;
		}
		catch {
			entityData._statusDetails.isError = true;
		}
	},

	processChildren: (context) => {
		const { data: { entityConfig: { children }}, data } = context;
		const { entityData, currentAction } = data;
		const { typeProcessors } = context;

		const parentAction = currentAction;

		return Promise.all(values(map(children, (childConfig, entityName) => {
			const { type, path } = childConfig;
			const isChildrenExists = isDefined(result(entityData, path));

			return isChildrenExists
			&& typeProcessors[type](services.buildContext({
				...context,
				data: {
					...data,
					childConfig,
					entityName,
					parentAction,
				},
			}));
		})));
	},

	encodeData: (context) => {
		const {	data: { entityData, entityConfig }} = context;
		const { mapping } = entityConfig;

		return reduce(
			mapping, (
				acc, { path, out }, key
			) => ({
				...acc,
				[key]: out(result(entityData, path)),
			}), {}
		);
	},

	decodeData: (context) => {
		const { data: { entityConfig, dbData }} = context;
		const { mapping } = entityConfig;

		return reduce(
			mapping, (
				acc, { path, in: decode }, field
			) => ({
				...acc,
				...createStructure({
					...context,
					data: {
						base: {},
						leaf: decode(dbData[field]),
						path: path,
					},
				}),
			}), {}
		);
	},

	buildStatusDetails: (context) => {
		const { data: { entityData, entityConfig }} = context;
		const { statusKey } = entityConfig;

		const entityDetails = {
			entityStatus: entityData[statusKey],
			hasAction: Boolean(entityData._statusDetails?.history.length),
		};

		const type = findKey(entityTypes, (entityType) =>
			contains(entityDetails, entityType));

		return types[type](context);
	},

	empty: () => {},

	isValidAction: (actionType) =>
		// Use doesContains instead of contains.
		find(adjacentActions, (actionDetails) =>
			contains(actionType, actionDetails)),
};

module.exports = services;
