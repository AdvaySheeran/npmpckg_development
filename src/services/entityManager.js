const {
	processChildren, processCallBack,	isValidAction,
	buildStatusDetails,
} = require('./index');
const { asyncMap } = require('../helpers');
const {
	findKey, contains, map,
	result, find,
} = require('@laufire/utils/collection');
const actions = require('./actions');
const fetch = require('./fetch');

const types = {
	action: {
		items: ['create', 'update', 'delete', 'fetch'],
		handler: (status, currentObj) => {
			const updateStatusDetails = (newStatus) => {
				currentObj._statusDetails.history = [
					...currentObj._statusDetails.history,
					newStatus,
				];
				currentObj._statusDetails.currentStatus = 'pending';
			};

			isValidAction({
				previousStatus: currentObj._statusDetails.history[0],
				currentStatus: status,
			}) && updateStatusDetails(status);
		},
	},
	status: {
		items: ['sync', 'syncing', 'deleted'],
		handler: (status, currentObj) => {
			currentObj._statusDetails.currentStatus = status;
		},
	},
};

const get = function () {
	return this._statusDetails.currentStatus;
};

const set = function (status) {
	const type = findKey(types, ({ items }) => items.includes(status));

	types[type].handler(status, this);
};

const hookProperties = { get, set };

const entityManager = {
	setHooks: (context) => {
		const { data: { entityData, entityConfig }} = context;
		const { statusKey } = entityConfig;

		entityData._statusDetails = buildStatusDetails(context);

		delete entityData[statusKey];

		Object.defineProperty(
			entityData, statusKey, {
				enumerable: true,
				...hookProperties,
			}
		);
	},

	isEntityHooked: (context) => {
		const { data: { entityData, entityConfig }} = context;
		const { statusKey } = entityConfig;
		// eslint-disable-next-line id-length
		const { getOwnPropertyDescriptor } = Object;

		return contains(getOwnPropertyDescriptor(entityData, statusKey),
			hookProperties);
	},

	getCurrentStatus: (context) => {
		const { data: { entityData: { _statusDetails }}} = context;

		return _statusDetails.currentStatus;
	},

	setProcessingFlag: (context) => {
		const { data: { entityData: { _statusDetails }}} = context;

		// Abstract setStatus.
		_statusDetails.currentStatus = 'syncing';
	},

	getCurrentAction: (context) => {
		const { data: { entityData: { _statusDetails: { history }}}} = context;

		return history[0];
	},

	shouldProcess: (context) => {
		const { data: { entityData: { _statusDetails }}} = context;

		const isPending = entityManager.getCurrentStatus(context) === 'pending';
		const notAError = !_statusDetails.isError;

		return isPending && notAError;
	},

	removeCurrentAction: (context) => {
		const { data: { entityData: { _statusDetails }}} = context;

		_statusDetails.history = _statusDetails.history.slice(1);
	},

	assignStatus: (context) => {
		const { data: { entityData: { _statusDetails }}} = context;
		const { history: { length }} = _statusDetails;
		const { data: { currentAction, entityStatus }} = context;

		_statusDetails.currentStatus = length
			? 'pending'
			: actions[currentAction]?.status || entityStatus;
	},

	setChildStatus: (context) => {
		const { data: { entityData, entityConfig, currentAction }} = context;
		const { children } = entityConfig;

		map(children, (childConfig) => {
			const { type, path } = childConfig;
			const childData = result(entityData, path);

			const transformed = type === 'entity' ? [childData] : childData;

			childData
			&& map(transformed, (entity) => (entity._status = currentAction));
		});
	},

	// Abstract predicate.
	processSelf: (context) =>
		asyncMap([processChildren], (fn) => fn(context)),

	processDown: async (context) => {
		await processCallBack(context);
		const { data: { entityData: { _statusDetails }}} = context;

		_statusDetails.isError || await processChildren(context);
	},

	processUp: async (context) => {
		const { data: { entityData: { _statusDetails }}} = context;

		await processChildren(context);
		const hasChildrenError = Boolean(entityManager
			.hasChildrenError(context));

		hasChildrenError || await processCallBack(context);
		hasChildrenError && (_statusDetails.isError = true);
	},

	hasChildrenError: (context) => {
		const { data: { entityData, entityConfig }} = context;
		const { children } = entityConfig;

		return find(children, ({ type, path }) => {
			const childData = result(entityData, path);

			const transformed = type === 'entity' ? [childData] : childData;

			return childData
			&& find(transformed, ({ _statusDetails: { isError }}) => isError);
		});
	},

	fetch: fetch,

	empty: () => {},
};

module.exports = entityManager;
