const actions = {
	delete: {
		action: 'processUp',
		status: 'deleted',
		processChildStatus: true,
	},
	fetch: {
		status: 'sync',
		action: 'fetch',
		setChildStatus: false,
	},
	create: {
		status: 'sync',
		action: 'processDown',
		setChildStatus: true,
	},
	update: {
		status: 'sync',
		action: 'processDown',
		setChildStatus: false,
	},
	uiDelete: {
		status: 'deleted',
		setChildStatus: true,
		action: 'empty',
	},
};

module.exports = actions;
