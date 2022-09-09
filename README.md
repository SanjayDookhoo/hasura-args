[![NodeJs][nodejs-image]][nodejs-url]
[![Maintained Status][maintained-image]][maintained-url]
[![Ask Me Anything][ask-image]][ask-url]
[![Issues Count][issues-image]][issues-url]
[![Size][size-image]][size-url]

[nodejs-image]: https://img.shields.io/badge/Node.js-43853D
[nodejs-url]: https://nodejs.org/
[maintained-image]: https://img.shields.io/badge/Maintained%3F-yes-green.svg
[maintained-url]: https://github.com/SanjayDookhoo/hasura-args
[ask-image]: https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg
[ask-url]: mailto:sanjaydookhoo@msn.com?subject=hasura-args
[issues-image]: https://img.shields.io/github/issues/SanjayDookhoo/hasura-args.svg
[issues-url]: https://github.com/SanjayDookhoo/hasura-args/issues
[size-image]: https://img.shields.io/bundlephobia/min/hasura-args
[size-url]: https://www.npmjs.com/package/hasura-args

# Description

Hasura gives you instant GraphQL & REST APIs on new & existing data sources. Unfortunately the mutation arguments can get pretty complicated at times. This package hopes to make it easier getting started with Hasura.

## Importing package

```javascript
import { objectToGraphqlArgs, objectToGraphqlMutationArgs } from 'hasura-args';
// CJS import example
// const {objectToGraphqlArgs, objectToGraphqlMutationArgs} = require('hasura-args');
```

## General usage for any Hasura argument

Take for example the following object

```javascript
const query = { where: { name: { _eq: 'Sidney' } } };
```

The matching Hasura query would be

```
query {
  authors(
    where: {name: {_eq: "Sidney"}}
  ) {
    id
    name
  }
}
```

This can be simplified as follows

```
query {
  authors(${objectToGraphqlArgs(query)}) {
    id
    name
  }
}
```

Note: The ability to use the javascript object wholesale for the query argument, also means the values of the javascript object can be dynamically changed as required, before the Hasura query is made

## Usage for any Hasura mutation argument

#### Inserting one record

Take for example the following object we would like to insert using Hasura

```javascript
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
```

The relevant Hasura mutation would be something like this. Notice that there is occurrences of the keyword, "object" and "data" a couple times, it would be tedious to convert an javascript object to this format, while maintaining graphql conventions. a simple JSON.stringify() will not be sufficient

```
mutation {
  insertFolderOne(
    object: {
      folderName: "folder 1",
      meta: {
        data: {
          userId: "123",
          sharingPermission: {
            data: {
              shareType: "RESTRICTED",
              sharingPermissionLinks: {
                data: [
                  {
                    accessType: "EDIT",
                    link: "www.test.com/link1",
                  },
                  {
                    accessType: "VIEW",
                    link: "www.test.com/link2",
                  },
                ],
              }
            },
          },
        },
      },
    }
  ) {
    id
  }
}
```

It certainly would be easier if the arguments inside insert_articles() could be filled in easily with a javascript object, wouldn't it?

This can be done with the package as shown below

```
mutation {
  insertFolderOne(${objectToGraphqlMutationArgs(testObject)}) {
    id
  }
}
```

#### Inserting multiple records

Take for example the following object we would like to insert using Hasura

```javascript
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
```

The relevant Hasura mutation would be something like this.

```
mutation {
  insertFolder(
    objects: [
      {
        folderName: "folder 1",
        meta: {
          data: {
            userId: "123",
            sharingPermission: {
              data: {
                shareType: "RESTRICTED",
                sharingPermissionLinks: {
                  data: [
                    {
                      accessType: "EDIT",
                      link: "www.test.com/link1",
                    },
                    {
                      accessType: "VIEW",
                      link: "www.test.com/link2",
                    },
                  ],
                }
              },
            },
          },
        },
      },
      {
        folderName: "folder 2",
        meta: {
          data: {
            userId: "123",
            sharingPermission: {
              data: {
                shareType: "RESTRICTED",
                sharingPermissionLinks: {
                  data: [
                    {
                      accessType: "EDIT",
                      link: "www.test.com/link3",
                    },
                    {
                      accessType: "VIEW",
                      link: "www.test.com/link4",
                    },
                  ],
                }
              },
            },
          },
        },
      },
    ]
  ) {
    id
  }
}
```

This can be simplified as follows

```
mutation {
  insertFolder(${objectToGraphqlMutationArgs(testArrayOfObjects)}) {
    id
  }
}
```
