const { empty } = require('.');
const entityManager = require('./entityManager');
const { isDefined } = require('@laufire/utils/reflection');
const getAction = require('../getAction');
const actions = require('./actions');

const {
	processSelf, getCurrentAction, setChildStatus,
} = entityManager;

const statusHandlers = {
	syncing: processSelf,
	deleted: empty,
	sync: processSelf,
	pending: async (context) => {
		const { data: { entityData, entityConfig, parentAction }} = context;
		const { idKey } = entityConfig;

		// Check whether appropriate action should be updated in history.
		const action = getAction({
			...context,
			data: {
				parentAction: parentAction,
				currentAction: getCurrentAction(context),
				idExists: isDefined(entityData[idKey]),
			},
		});

		context.data.currentAction = action;

		const { processChildStatus, action: handler } = actions[action];

		processChildStatus && setChildStatus(context);

		await entityManager[handler](context);
	},
};

module.exports = statusHandlers;
