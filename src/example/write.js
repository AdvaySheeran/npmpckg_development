

const init = require('./index');
const { statusKey, idKey } = require('../constants');

const source = {
	refId: 3000972,
	_status: 'sync',
	bibliographyList: [
		{
			[statusKey]: 'create',
			proteinConcentration: {
				from: '+',
				fromValue: '3',
				fromRange: {
					_id: '618b66767d2160ff287468e4',
					fieldName: 'DOSE_UOM ',
					fieldData: 'uL/min/mg',
					doseUomId: 8,
					listType: 'LIST_STANDARD_UOM',
					createdOn: {
						$date: '2021-11-10T11:58:06.857Z',
					},
					modifiedOn: {
						$date: '2021-11-10T11:58:06.857Z',
					},
					status: 'Approved',
				},
				to: '~',
				toValue: '4',
				toRange: {
					_id: '618b66767d2160ff287468e4',
					fieldName: 'DOSE_UOM ',
					fieldData: 'uL/min/mg',
					doseUomId: 8,
					listType: 'LIST_STANDARD_UOM',
					createdOn: {
						$date: '2021-11-10T11:58:06.857Z',
					},
					modifiedOn: {
						$date: '2021-11-10T11:58:06.857Z',
					},
					status: 'Approved',
				},
			},
		},
	],
};

const config = {
	type: 'entity',
	path: '/',
	idKey: 'refId',
	statusKey: '_status',
	parentKey: 'refId',
	mapping: {
		refId: 'id',
	},
	children: {
		bibliographyList: {
			type: 'collection',
			path: './bibliographyList',
			idKey: 'id',
			statusKey: '_status',
			mapping: {
				id: 'id',
				proteinConcentrationFrom: './proteinConcentration/from',
			},
			children: {},
		},
	},
};

init({
	source,
	config,
});
