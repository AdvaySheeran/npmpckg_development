const { count, map, contains } = require('@laufire/utils/collection');
const { identity } = require('@laufire/utils/fn');
const { statusKey, idKey } = require('./constants');
const apiData = require('./mocks');
const { config: normalizeConfig } = require('./normalizer');
const parser = require('./parser');
const { buildStatusDetails } = require('./services');
const typeProcessors = require('./typeProcessors');

describe('parser', () => {
	const parentProp = Symbol('parentProp');
	const childProp = Symbol('childProp');
	const id = Symbol('id');

	test('Traverse through data and make necessary api call.',
		async () => {
			const mockCb = jest.fn(({ data, entityName }) =>
				apiData[entityName] || data);

			const generateSkeleton = ({
				parentStatus, childStatus, childName,
				parentName,
			}) =>
				({
					config: {
						type: 'entity',
						path: parentName,
						idKey: 'id',
						statusKey: '_status',
						disabled: false,
						mapping: {
							[idKey]: {
								path: idKey,
								in: identity,
								out: identity,
							},
							parentProp: {
								path: 'parentProp',
								in: identity,
								out: identity,
							},
						},
						children: {
							[childName]: {
								type: 'collection',
								path: childName,
								parentKey: 'customerId',
								idKey: 'id',
								statusKey: '_status',
								disabled: false,
								mapping: {
									[idKey]: {
										path: idKey,
										in: identity,
										out: identity,
									},
									childProp: {
										path: 'childProp',
										in: identity,
										out: identity,
									},
								},
								children: {},
							},
						},
					},
					source: {
						[idKey]: id,
						parentProp: parentProp,
						[childName]: [
							{
								[idKey]: id,
								childProp: childProp,
								[statusKey]: childStatus,
							},
						],
						[statusKey]: parentStatus,
					},
				});
			const {
				config: customerConfig,
				source: customerSource,
			} = generateSkeleton({
				parentStatus: 'delete',
				childStatus: 'create',
				childName: 'orders',
				parentName: 'customer',
			});
			const {
				config: studentConfig,
				source: studentSource,
			} = generateSkeleton({
				parentStatus: 'update',
				childStatus: 'update',
				childName: 'marks',
				parentName: 'student',
			});
			const source = {
				[idKey]: id,
				[statusKey]: 'sync',
				customer: customerSource,
				student: studentSource,
			};
			const config = {
				type: 'entity',
				path: '/',
				idKey: 'id',
				statusKey: '_status',
				mapping: {
					id: 'id',
				},
				children: {
					customer: customerConfig,
					student: studentConfig,
				},
			};
			const context = {
				typeProcessors: typeProcessors,
				source: source,
				config: normalizeConfig({ data: config }),
				cb: mockCb,
			};

			await parser(context);

			const expectations = [
				{
					...context,
					action: 'delete',
					data: {
						customerId: id,
						id: id,
						childProp: childProp,
					},
					parentKey: 'customerId',
					entityName: 'orders',
					parentId: id,
				},
				{
					...context,
					parentId: id,
					action: 'delete',
					data: {
						id,
						parentProp,
					},
					entityName: 'customer',
				},
				{
					...context,
					parentId: id,
					action: 'update',
					data: {
						id,
						parentProp,
					},
					entityName: 'student',
				},
				{
					...context,
					action: 'update',
					data: {
						customerId: id,
						id: id,
						childProp: childProp,
					},
					entityName: 'marks',
					parentId: id,
					parentKey: 'customerId',
				},
			];

			expect(mockCb.mock.calls.flat().every((received) =>
				expectations.find((expected) =>
					contains(expected, received))))
				.toBeTruthy();
		});

	test('Build source entity.', async () => {
		const mockCb = jest.fn(({ entityName, data }) =>
			apiData[entityName] || data);
		const customerSource = {
			[idKey]: id,
			parentProp: parentProp,
			[statusKey]: 'fetch',
		};
		const customerConfig = {
			path: './customer',
			type: 'entity',
			idKey: 'id',
			statusKey: '_status',
			mapping: {
				parentProp,
			},
			children: {
				orders: {
					path: './orders',
					type: 'collection',
					parentKey: 'customerId',
					idKey: 'id',
					statusKey: '_status',
					mapping: {
						[idKey]: 'id',
						date: 'data/id',
					},
					children: {},
				},
				deliveryAddress: {
					path: './deliveryAddress',
					type: 'entity',
					idKey: 'id',
					statusKey: '_status',
					parentKey: 'customerId',
					mapping: {
						[idKey]: 'id',
					},
				},
			},
		};
		const context = {
			source: {
				[idKey]: id,
				[statusKey]: 'sync',
				customer: customerSource,
			},
			config: normalizeConfig({
				data: {
					type: 'entity',
					path: '/',
					idKey: 'id',
					statusKey: '_status',
					mapping: {
						id: 'id',
					},
					children: {
						customer: customerConfig,
					},
				},
			}),
			cb: mockCb,
			typeProcessors: typeProcessors,
		};

		await parser(context);

		const expectations = [
			{
				...context,
				action: 'fetch',
				entityName: 'orders',
				data: {
					customerId: id,
				},
				parentKey: 'customerId',
				parentId: id,
			},
			{
				...context,
				action: 'fetch',
				entityName: 'deliveryAddress',
				data: {
					customerId: id,
				},
				parentKey: 'customerId',
				parentId: id,
			},
		];

		expect(mockCb.mock.calls.flat()).toEqual(expectations);
	});

	test('Inappropriate structure.', async () => {
		const context = {
			source: {
				_status: 'sync',
				customer: {
					[idKey]: '',
					[statusKey]: 'create',
				},
			},
			config: normalizeConfig({
				data: {
					type: 'entity',
					path: '/',
					idKey: 'id',
					statusKey: '_status',
					mapping: {
						id: 'id',
					},
					children: {
						customer: {
							path: '/customer',
							type: 'entity',
							idKey: 'id',
							statusKey: '_status',
							mapping: {
								[idKey]: 'id',
							},
							children: {},
						},
					},
				},
			}),
			cb: jest.fn(),
		};

		const ex = () => parser(context);

		await expect(ex).rejects.toThrow(Error);
	});

	test('Parser handles uiDelete.', async () => {
		const context = {
			source: {
				[statusKey]: 'delete',
			},
			config: normalizeConfig({
				data: {
					type: 'entity',
					path: '/',
					idKey: 'id',
					statusKey: '_status',
					mapping: {
						id: 'id',
					},
				},
			}),
			cb: jest.fn(),
		};

		await parser(context);

		expect(context.source[statusKey]).toEqual('deleted');
	});

	test('Parallel processing.', async () => {
		const mockCb = jest.fn(({ data, entityName }) =>
			apiData[entityName] || data);
		const context = {
			source: {
				[idKey]: id,
				[statusKey]: 'sync',
				orders: [
					{
						[statusKey]: 'create',
					},
				],
			},
			config: normalizeConfig({
				data: {
					type: 'entity',
					path: '/',
					idKey: idKey,
					statusKey: '_status',
					parentKey: idKey,
					mapping: {
						id: 'refId',
					},
					children: {
						orders: {
							type: 'collection',
							path: './orders',
							idKey: 'id',
							statusKey: '_status',
							mapping: {
								[idKey]: 'id',
								date: 'data/id',
							},
						},
					},
				},
			}),
			cb: mockCb,
		};

		parser(context);
		await parser(context);

		expect(count(mockCb.mock.calls.flat())).toBeLessThan(2);
	});

	test('builds _statusDetails based on entity.', () => {
		const cases = [
			{
				input: {
					_status: 'sync',
				},
				expectation: {
					history: [],
					currentStatus: 'sync',
				},
			},
			{
				input: {
					_status: 'deleted',
				},
				expectation: {
					history: [],
					currentStatus: 'deleted',
				},
			},
			{
				input: {
					_status: 'create',
				},
				expectation: {
					history: ['create'],
					currentStatus: 'pending',
				},
			},
			{
				input: {
					id: 1,
				},
				expectation: {
					history: ['fetch'],
					currentStatus: 'pending',
				},
			},
			{
				input: {
					_status: 'update',
					_statusDetails: {
						history: [],
						currentStatus: 'sync',
					},
				},
				expectation: {
					history: ['update'],
					currentStatus: 'pending',
				},
			},
			{
				input: {
					_statusDetails: {
						history: ['update'],
						currentStatus: 'pending',
					},
				},
				expectation: {
					history: ['update'],
					currentStatus: 'pending',
				},
			},
		];

		map(cases, ({ input, expectation }) => {
			const received = buildStatusDetails({
				data: {
					entityData: input,
					entityConfig: {
						statusKey: '_status',
					},
				},
			});

			expect(received).toEqual(expectation);
		});
	});
});
