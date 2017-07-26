[![NPM version](http://img.shields.io/npm/v/lodash-collection-helpers.svg?style=flat)][npm-url] [![NPM downloads](http://img.shields.io/npm/dm/lodash-collection-helpers.svg?style=flat)][npm-url] [![Build Status](https://travis-ci.org/JSystemsTech/lodash-collection-helpers.svg?branch=master)][travis-url] [![Coverage Status](https://coveralls.io/repos/github/JSystemsTech/lodash-collection-helpers/badge.svg?branch=master)][coverage-url] [![Dependency Status](https://david-dm.org/JSystemsTech/lodash-collection-helpers.svg?style=flat)][dependencies-url] [![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)][license-url] <a href="https://github.com/JSystemsTech/lodash-collection-helpers#README"><img src="https://github.com/JSystemsTech/lodash-collection-helpers/raw/v1-0-0-dev/gulpCustomPlugins/customBadges/bower-badge.png" alt="Bower Package" height="30" width="130"></a>
## <a name="69636237-0a3a-42a7-b6a4-5de2ba9a4dac"></a>Table of Contents
1. [Installation](#81f0fd99-4571-4d9a-9dcb-f1acafec26a7)
2. [Usage](#8ae79067-704c-4ae0-bea1-4403658d81f3)
3. [Lodash Integration](#751a30c9-3902-424e-9221-f81a6a9f5f04)
4. [Contributing](#56c33969-2c9c-4684-9445-61d2e30c0c04)
5. [Release History](#079596e2-9f14-4821-8873-513e759ee399)

## <a name="81f0fd99-4571-4d9a-9dcb-f1acafec26a7"></a>Installation
| Installation Type | Command |
| :----: | ---- |
| npm | npm install lodash-collection-helpers --save |
| bower | bower install lodash-collection-helpers |

## <a name="8ae79067-704c-4ae0-bea1-4403658d81f3"></a>Usage
``` javascript
var collectionHelpers = require('lodash-collection-helpers');
```

Need an ES5 version?

``` javascript
var collectionHelpers = require('lodash-collection-helpers/dist/lodash-collection-helpers-es2015');
```

| Available Helpers in the Library |
| ---- |
| isCollection |
| pickAs |
| pickAllAs |
| select |
| selectAll |
| joinOn |
| leftJoin |
| rightJoin |
| innerJoin |
| fullJoin |
| leftAntiJoin |
| rightAntiJoin |
| fullAntiJoin |
| getCollectionHelpers |

For further instruction on how to use this library please referense the [Documentation][documentation-url]

## <a name="751a30c9-3902-424e-9221-f81a6a9f5f04"></a>Lodash Integration
Prefer to call these helpers directlly from your projest's lodash reference?
Simply execute code like this example below and you are all set.

``` javascript
var collectionHelpers = require('lodash-collection-helpers');
var _ = require('lodash');
_.mixin(collectionHelpers.getCollectionHelpers());
```

| Integrated Lodash Function |
| ---- |
| _.isCollection |
| _.pickAs |
| _.pickAllAs |
| _.select |
| _.selectAll |
| _.joinOn |
| _.leftJoin |
| _.rightJoin |
| _.innerJoin |
| _.fullJoin |
| _.leftAntiJoin |
| _.rightAntiJoin |
| _.fullAntiJoin |

## <a name="56c33969-2c9c-4684-9445-61d2e30c0c04"></a>Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## <a name="079596e2-9f14-4821-8873-513e759ee399"></a>Release History
| Release Number | Comment |
| ---- | ---- |
| 1.0.0 | Initial release |

[Return to Top](#69636237-0a3a-42a7-b6a4-5de2ba9a4dac)

[license-url]: LICENSE
[npm-url]: https://www.npmjs.com/package/lodash-collection-helpers
[travis-url]: https://travis-ci.org/JSystemsTech/lodash-collection-helpers?branch=master
[dependencies-url]: https://david-dm.org/JSystemsTech/lodash-collection-helpers
[coverage-url]: https://coveralls.io/repos/github/JSystemsTech/lodash-collection-helpers?branch=master
[documentation-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/v1-0-0-dev/DOCUMENTATION.md