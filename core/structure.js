const { statusKey, idKey } = require('../src/constants');

const customer = {
	name: '',
	mobileNumber: '',
	age: '23',
	billingAddress: {
		city: '',
		pincode: '',
		street: '',
	},
	orders: [
		{
			[idKey]: 'orderId',
			date: '',
			invoiceNumber: '',
			deliveryDate: '',
			deliveryAddress: {
				[idKey]: '',
				city: '',
				pincode: '',
				street: '',
				[statusKey]: 'create',
			},
			cecDataGrid: {
				dataCore: [
					{
						[idKey]: 'dataCoreId',
						name: 'dataCore',
						[statusKey]: 'create',
					},
				],
			},
			products: [
				{
					[idKey]: 'productId',
					name: '',
					quantity: '',
					price: 1,
					[statusKey]: 'create',
				},
			],
			[statusKey]: 'delete',
		},
	],

	// CRUD actions
	[statusKey]: 'create',
};

module.exports = { customer };
