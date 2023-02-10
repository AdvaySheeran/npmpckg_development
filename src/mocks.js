const { idKey, statusKey } = require('./constants');

const deliveryAddress = [
	{
		id: 1,
		city: '',
		pincode: '',
		street: '',
		[statusKey]: 'fetch',
	},
];
const products = [
	{
		[idKey]: '',
		name: '',
		quantity: '',
		price: 1,
		[statusKey]: 'fetch',
	},
	{
		[idKey]: '',
		name: '',
		quantity: '',
		price: 2,
		[statusKey]: 'fetch',
	},
];
const dataGrid = [
	{
		id: 'id',
		name: 'name',
		[statusKey]: 'fetch',
	},
];
const cecDataGrid = {
	dataGrid,
};
const customer = {
	cId: 'customerId',
	years: 'newAge',
};
const apiData = {
	customer: customer,
	orders: [
		{
			[idKey]: '',
			date: '',
			invoiceNumber: '',
			deliveryDate: '',
			cecDataGrid: cecDataGrid,
			[statusKey]: 'fetch',
		},
	],
	deliveryAddress: deliveryAddress,
	products: products,
	cecDataGrid: dataGrid,
};

module.exports = apiData;
