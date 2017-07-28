[![NPM version](http://img.shields.io/npm/v/lodash-collection-helpers.svg?style=flat)][npm-url] [![NPM downloads](http://img.shields.io/npm/dm/lodash-collection-helpers.svg?style=flat)][npm-url] [![Build Status](https://travis-ci.org/JSystemsTech/lodash-collection-helpers.svg?branch=master)][travis-url] [![Coverage Status](https://coveralls.io/repos/github/JSystemsTech/lodash-collection-helpers/badge.svg?branch=master)][coverage-url] [![Dependency Status](https://david-dm.org/JSystemsTech/lodash-collection-helpers.svg?style=flat)][dependencies-url] [![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)][license-url] <a href="https://github.com/JSystemsTech/lodash-collection-helpers#README"><img src="https://github.com/JSystemsTech/lodash-collection-helpers/raw/v1-0-0-dev/gulpCustomPlugins/customBadges/bower-badge.png" alt="Bower Package" height="30" width="130"></a>
## <a name="8527be2d-f789-4468-9876-f19f726de45c"></a>Table of Contents
1. [Installation](#c89dfc32-e2c0-434f-80fd-f716c89fa756)
2. [Usage](#78f41659-19ce-409f-bb8c-8ef35e910f8b)
3. [Lodash Integration](#bb1de07b-dc26-49cd-9e23-0549273c2b2d)
4. [Contributing](#6a97048a-e681-48d7-969b-7c13dbc60b6f)
5. [Release History](#306fcafd-ff41-4334-b981-82506842a77b)

## <a name="c89dfc32-e2c0-434f-80fd-f716c89fa756"></a>Installation
| Installation Type | Command |
| :----: | ---- |
| npm | npm install lodash-collection-helpers --save |
| bower | bower install lodash-collection-helpers |

## <a name="78f41659-19ce-409f-bb8c-8ef35e910f8b"></a>Usage
``` javascript
var collectionHelpers = require('lodash-collection-helpers');
```

Need an ES5 version?

``` javascript
var collectionHelpers = require('lodash-collection-helpers/dist/lodash-collection-helpers-es5');
```

| Available Helpers in the Library |
| ---- |
| [isCollection][isCollection-url] |
| [pickAs][pickAs-url] |
| [pickAllAs][pickAllAs-url] |
| [select][select-url] |
| [selectAll][selectAll-url] |
| [joinOn][joinOn-url] |
| [leftJoin][leftJoin-url] |
| [rightJoin][rightJoin-url] |
| [innerJoin][innerJoin-url] |
| [fullJoin][fullJoin-url] |
| [leftAntiJoin][leftAntiJoin-url] |
| [rightAntiJoin][rightAntiJoin-url] |
| [fullAntiJoin][fullAntiJoin-url] |
| [getCollectionHelpers][getCollectionHelpers-url] |

For further instruction on how to use this library please referense the [Documentation][documentation-url]

## <a name="bb1de07b-dc26-49cd-9e23-0549273c2b2d"></a>Lodash Integration
Prefer to call these helpers directlly from your projest's lodash reference?
Simply execute code like this example below and you are all set.

``` javascript
var collectionHelpers = require('lodash-collection-helpers');
var _ = require('lodash');
_.mixin(collectionHelpers.getCollectionHelpers());
```

| Integrated Lodash Function |
| ---- |
| [_.isCollection][isCollection-url] |
| [_.pickAs][pickAs-url] |
| [_.pickAllAs][pickAllAs-url] |
| [_.select][select-url] |
| [_.selectAll][selectAll-url] |
| [_.joinOn][joinOn-url] |
| [_.leftJoin][leftJoin-url] |
| [_.rightJoin][rightJoin-url] |
| [_.innerJoin][innerJoin-url] |
| [_.fullJoin][fullJoin-url] |
| [_.leftAntiJoin][leftAntiJoin-url] |
| [_.rightAntiJoin][rightAntiJoin-url] |
| [_.fullAntiJoin][fullAntiJoin-url] |

## <a name="6a97048a-e681-48d7-969b-7c13dbc60b6f"></a>Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## <a name="306fcafd-ff41-4334-b981-82506842a77b"></a>Release History
| Release Number | Comment |
| ---- | ---- |
| 1.0.0 | Initial release |

[Return to Top](#8527be2d-f789-4468-9876-f19f726de45c)

[license-url]: LICENSE
[npm-url]: https://www.npmjs.com/package/lodash-collection-helpers
[travis-url]: https://travis-ci.org/JSystemsTech/lodash-collection-helpers?branch=master
[dependencies-url]: https://david-dm.org/JSystemsTech/lodash-collection-helpers
[coverage-url]: https://coveralls.io/repos/github/JSystemsTech/lodash-collection-helpers?branch=master
[documentation-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/v1-0-0-dev/DOCUMENTATION.md
[isCollection-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/v1-0-0-dev/DOCUMENTATION.md#iscollection
[pickAs-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/v1-0-0-dev/DOCUMENTATION.md#pickas
[pickAllAs-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/v1-0-0-dev/DOCUMENTATION.md#pickallas
[select-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/v1-0-0-dev/DOCUMENTATION.md#select
[selectAll-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/v1-0-0-dev/DOCUMENTATION.md#selectall
[joinOn-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/v1-0-0-dev/DOCUMENTATION.md#joinon
[leftJoin-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/v1-0-0-dev/DOCUMENTATION.md#leftjoin
[rightJoin-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/v1-0-0-dev/DOCUMENTATION.md#rightjoin
[innerJoin-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/v1-0-0-dev/DOCUMENTATION.md#innerjoin
[fullJoin-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/v1-0-0-dev/DOCUMENTATION.md#fulljoin
[leftAntiJoin-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/v1-0-0-dev/DOCUMENTATION.md#leftantijoin
[rightAntiJoin-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/v1-0-0-dev/DOCUMENTATION.md#rightantijoin
[fullAntiJoin-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/v1-0-0-dev/DOCUMENTATION.md#fullantijoin
[getCollectionHelpers-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/v1-0-0-dev/DOCUMENTATION.md#getcollectionhelpers