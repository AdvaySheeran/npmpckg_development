const init = require('./index');
const { statusKey, idKey } = require('../constants');

const source = {
	bibliographyList: [
		{
			[idKey]: 1,
			[statusKey]: 'update',
			referenceId: 1,
			doi: 0,
			files: false,
			title: 'Title Name',
			abstract: 'Abstract Val',
			articleKeywords: 'AK1;AK2;AK3',
			authorName: 'AuthorName1;AuthorName2;AuthorName3',
			companyName: 'CompanyName1;CompanyName2;CompanyName3',
			companyDetails: 'CompanyDetails1;CompanyDetails2;CompanyDetails3',
			meShTerms: 'MT1;MT2;MT3',
			clearBibliography: false,
			rejectBibliography: false,
			previewBibliography: false,
			saveBibliography: false,
			referenceName: 'ACS Chemical Biology, 2019, 14, (12) 2652-2662',
			flowType: 'discovery',
			referenceType: 'journal',
			filesBibliographyList: [
				'Main File',
				'Sup File',
			],
			pubMedId: 987654,
			primaryAnatomyTarget: {
				dataCore: [
					{
						[statusKey]: 'update',
						_id: '61a97f001665bf929bf95958',
						synonymsList: [
							'Vas deferens',
							'Ductus deferens',
						],
						fieldData: 'fieldDataOne',
						organId: 1,
						status: 'Approved',
					},
					{
						[statusKey]: 'update',
						_id: '61a97f001665bf929bf95957',
						synonymsList: [
							'Pancreas',
						],
						fieldData: 'fielDataTwo',
						organId: 2,
						status: 'Approved',
					},
				],
			},
			primaryIndication: {
				dataCore: [
					{
						[statusKey]: 'delete',
						_id: '6195f35f55182176347a14d7',
						fieldData: 'Seizure',
						indAeId: 1,
						status: 'Approved',
						synonymsList: [
							'Seizure',
							'Seizure',
							'Fit',
							'Seizure',
							'Seizure',
							'Fit',
						],
					},
					{
						[statusKey]: 'delete',
						_id: '6195f35f55182176347a14d6',
						fieldData: 'Fever',
						indAeId: 3,
						status: 'Approved',
						synonymsList: [
							'Fever',
							'Fever',
							'Pyrexia',
							'Fever',
							'Fever',
							'Pyrexia',
						],
					},
				],
			},
			authorAndCompanyDetails: {
				dataCore: [
					{
						_id: '1',
						primary: '',
						authorNameAcd: {
							field: 'authorName',
							fieldData: 'AuthorName1',
						},
						companyNameAcd: {
							field: 'companyName',
							fieldData: 'CompanyName1',
						},
						companyDetailsAcd: {
							field: 'companyDetails',
							fieldData: 'CompanyDetails2',
						},
						standardCompanyNameAcd: {
							_id: '615ad7c5040ca80008521c48',
							fieldData: 'UNIVERSITAT LEIPZIG',
							compNameId: 18,
							status: 'Approved',
							synonyms: '',
							synonymsList: [],
						},
						phoneNumber: '9988776655',
						email: 'email1@gmail.com',
						individualAddress: 'HYD',
					},
					{
						_id: '2',
						primary: true,
						authorNameAcd: {
							field: 'authorName',
							fieldData: 'AuthorName3',
						},
						companyNameAcd: {
							field: 'companyName',
							fieldData: 'CompanyName2',
						},
						companyDetailsAcd: {
							field: 'companyDetails',
							fieldData: 'CompanyDetails3',
						},
						standardCompanyNameAcd: {
							_id: '615ad7c5040ca80008521c45',
							compNameId: 9,
							status: 'Approved',
							synonyms: '',
							synonymsList: [],
						},
						phoneNumber: '6677445599',
						email: 'email4@gmail.com',
						individualAddress: 'MB;PB',
					},
				],
			},
			proteinProteinInteraction: {
				dataCore: [
					{
						ppiProteinA: {
							_id: '6195f234885bdb8945e2be9e',
							stdNameId: 7,
							status: 'Approved',
							synonyms: '',
							synonymsList: [],
						},
						ppiProteinB: {
							_id: '619f7a171404e7172a263d37',
							fieldData: 'Stan7',
							stdNameId: 200064,
							status: 'Approved',
							synonyms: 'a7, b7, c7, pro7, Com7',
							synonymsList: [
								'a7',
								'b7',
								'c7',
								'pro7',
								'Com7',
							],
						},
						natureOfInteraction: 'NOI1',
						ppiNetEffectPi: 'NE1',
					},
					{
						ppiProteinA: {
							_id: '619f7a171404e7172a263d37',
							fieldData: 'Stan7',
							stdNameId: 200064,
							status: 'Approved',
							synonyms: 'a7, b7, c7, pro7, Com7',
							synonymsList: [
								'a7',
								'b7',
								'c7',
								'pro7',
								'Com7',
							],
						},
						ppiProteinB: {
							_id: '619f7a131404e7172a263d36',
							fieldData: 'Stan6',
							stdNameId: 200065,
							status: 'Approved',
							synonyms: 'a6, b6, c6, pro6, Com6',
							synonymsList: [
								'a6',
								'b6',
								'c6',
								'pro6',
								'Com6',
							],
						},
						natureOfInteraction: 'NOIVal',
						ppiNetEffectPi: 'NEVal',
					},
				],
			},
		},
	],
};

const config = {
	statusKey: statusKey,
	idKey: idKey,
	children: {
		bibliographyList: {
			idKey: 'id',
			statusKey: '_status',
			mapping: {
				id: 'id',
				meShTerms: {
					prop: 'meShTerms',
					in: (val) => val.join(';'),
					out: (val) => val.split(';'),
				},
			},
			path: './bibliographyList',
			type: 'collection',
			children: {},
		},
	},
};

init({
	source,
	config,
});
