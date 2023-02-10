

const parser = require('./index');

const data = {
	refId: 3000972,
	_status: 'fetch',
};

const config = {
	type: 'entity',
	path: '/',
	idKey: 'refId',
	statusKey: '_status',
	parentKey: 'refId',
	disabled: true,
	mapping: {
		refId: 'id',
	},
	children: {
		bibliographyList: {
			type: 'collection',
			path: './bibliographyList',
			idKey: 'id',
			statusKey: '_status',
			parentKey: 'refId',
			mapping: {
				id: 'id',
				title: './data/title',
			},
			children: {
				paTarget: {
					type: 'collection',
					path: './primaryAnatomyTarget',
					idKey: 'id',
					statusKey: '_status',
					parentKey: 'bibliographyListId',
					mapping: {
						id: 'id',
					},
				},
			},
		},
	},
};

parser({
	source: data,
	config: config,
});
