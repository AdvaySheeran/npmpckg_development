const axios = require('axios');
const fs = require('fs');
const { pretty, sleep } = require('@laufire/utils/debug');
const parser = require('../parser');

require('dotenv').config();

const baseURL = `http://localhost:${ process.env.PORT }/`;

const makeRequest = ({ data }) => axios(data);

const request = {
	create: async (context) => {
		const { data, entityName } = context;

		const response = await makeRequest({
			...context,
			data: {
				method: 'post',
				url: `${ baseURL }${ entityName }`,
				data: data,
			},
		});

		return response.data;
	},
	update: async (context) => {
		const { data, entityName, data: { id }} = context;

		const response = await makeRequest({
			...context,
			data: {
				method: 'put',
				url: `${ baseURL }${ entityName }/${ id }`,
				data: data,
			},
		});

		return response.data;
	},
	delete: async (context) => {
		const { data, entityName, data: { id }} = context;

		const response = await makeRequest({
			...context,
			data: {
				method: 'delete',
				url: `${ baseURL }${ entityName }/${ id }`,
				data: data,
			},
		});

		return response.data;
	},
	fetch: async (context) => {
		const { entityName, parentId, parentKey } = context;

		const response = await makeRequest({
			...context,
			data: {
				method: 'get',
				url: `${ baseURL }${ entityName }?${ parentKey }=${ parentId }`,
			},
		});

		return response.data;
	},
};

const cb = async (context) => {
	const { action } = context;

	await sleep();

	return request[action](context);
};

const init = async (context) => {
	await parser({ ...context, cb });
	fs.writeFileSync('./src/example/.output.json', pretty(context.source));
};

module.exports = init;
