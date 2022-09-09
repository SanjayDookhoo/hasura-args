import {
	objectToGraphqlArgs,
	objectToGraphqlMutationArgs,
} from '../lib/index.js';

const query = { where: { name: { _eq: 'Sidney' } } };

const testObject = {
	folderName: 'folder 1',
	meta: {
		userId: '123',
		sharingPermission: {
			shareType: 'RESTRICTED',
			sharingPermissionLinks: [
				{
					accessType: 'EDIT',
					link: 'www.test.com/link1',
				},
				{
					accessType: 'VIEW',
					link: 'www.test.com/link2',
				},
			],
		},
	},
};

const testArrayOfObjects = [
	{
		folderName: 'folder 1',
		meta: {
			userId: '123',
			sharingPermission: {
				shareType: 'RESTRICTED',
				sharingPermissionLinks: [
					{
						accessType: 'EDIT',
						link: 'www.test.com/link1',
					},
					{
						accessType: 'VIEW',
						link: 'www.test.com/link2',
					},
				],
			},
		},
	},
	{
		folderName: 'folder 2',
		meta: {
			userId: '123',
			sharingPermission: {
				shareType: 'RESTRICTED',
				sharingPermissionLinks: [
					{
						accessType: 'EDIT',
						link: 'www.test.com/link3',
					},
					{
						accessType: 'VIEW',
						link: 'www.test.com/link4',
					},
				],
			},
		},
	},
];

const args = objectToGraphqlArgs(query);
// const args = objectToGraphqlMutationArgs(testObject);
// const args = objectToGraphqlMutationArgs(testArrayOfObjects);

console.log(args);
