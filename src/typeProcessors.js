/* eslint-disable complexity */
const { asyncMap } = require('./helpers');
const {
	isEntityHooked, setHooks, setProcessingFlag,
	getCurrentStatus, shouldProcess, removeCurrentAction,
	assignStatus,
} = require('./services/entityManager');
const statusManager = require('./services/statusManager');

const entity = async (context) => {
	const { data: { entityConfig: { disabled }}} = context;

	isEntityHooked(context) || setHooks(context);

	const entityStatus = getCurrentStatus(context);

	context.data.entityStatus = entityStatus;

	setProcessingFlag(context);

	// Decide where to place disabled.
	!disabled && await statusManager[entityStatus](context);

	const { isError } = context.data.entityData._statusDetails;

	isError || removeCurrentAction(context);

	assignStatus(context);

	shouldProcess(context) && await entity(context);
};

const collection = async (context) => {
	// Not a entity it should collection
	const { data: { entityData: entityCollection }, data } = context;
	const { typeProcessors: { entity: typeEntity }} = context;

	await asyncMap(entityCollection, async (entityData) => {
		await typeEntity({
			...context,
			data: {
				...data,
				entityData,
			},
		});
	});
};

const typeProcessors = {
	entity,
	collection,
};

module.exports = typeProcessors;
