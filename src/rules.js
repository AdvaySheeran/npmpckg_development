const rules = [
	{
		parentAction: 'delete',
		idExists: true,
		action: 'delete',
	},
	{
		parentAction: 'delete',
		idExists: false,
		action: 'uiDelete',
	},
	{
		currentAction: 'delete',
		idExists: true,
		action: 'delete',
	},
	{
		currentAction: 'delete',
		idExists: false,
		action: 'uiDelete',
	},
	{
		parentAction: 'uiDelete',
		action: 'uiDelete',
	},
	{
		parentAction: 'create',
		action: 'create',
	},
	{
		idExists: false,
		action: 'create',
	},
	{
		currentAction: 'update',
		idExists: true,
		action: 'update',
	},
	{
		currentAction: 'fetch',
		idExists: true,
		action: 'fetch',
	},
	{
		idExists: true,
		action: 'error',
	},
];

module.exports = rules;
