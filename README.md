# Lodash Collection Helpers
*Lodash plugin library for additional collection functions*

[![NPM version](http://img.shields.io/npm/v/lodash-collection-helpers.svg?style=flat)][npm-url] [![NPM downloads](http://img.shields.io/npm/dm/lodash-collection-helpers.svg?style=flat)][npm-url] [![Build Status](https://travis-ci.org/JSystemsTech/lodash-collection-helpers.svg?branch=release%2F1-1-0)][travis-url] [![Coverage Status](https://coveralls.io/repos/github/JSystemsTech/lodash-collection-helpers/badge.svg?branch=release%2F1-1-0)][coverage-url] [![Dependency Status](https://david-dm.org/JSystemsTech/lodash-collection-helpers.svg?style=flat&branch=release%2F1-1-0)][dependencies-url] [![devDependencies Status](https://david-dm.org/JSystemsTech/lodash-collection-helpers/dev-status.svg?branch=release%2F1-1-0)][dev-dependencies-url] [![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)][license-url] <a href="https://github.com/JSystemsTech/lodash-collection-helpers#README"><img src="https://github.com/JSystemsTech/lodash-collection-helpers/raw/release/1-1-0/gulpCustomPlugins/customBadges/bower-badge.png" alt="Bower Package" height="30" width="130"></a>
## <a name="770197a8-5291-4996-b8c8-aa5d9fb94f11"></a>Table of Contents
1. [Installation](#6c7136b8-1de0-4501-98f7-6cc0b5582d8e)

2. [Usage](#37904e69-d0b7-422d-bd8d-9397fb9a7273)

3. [Lodash Integration](#57442f8a-f37a-44e7-8451-ddaf77211098)

4. [Contributing](#abbec97b-5fbb-4f1f-90f8-6f1c87a96c0b)

5. [Release History](#de000503-32bc-40f6-8c03-2a7686e7d18b)

## <a name="6c7136b8-1de0-4501-98f7-6cc0b5582d8e"></a>Installation
| Installation Type | Command |
| :----: | ---- |
| npm | npm install lodash-collection-helpers --save |
| bower | bower install lodash-collection-helpers |
| yarn | yarn add lodash-collection-helpers |

## <a name="37904e69-d0b7-422d-bd8d-9397fb9a7273"></a>Usage
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

## <a name="57442f8a-f37a-44e7-8451-ddaf77211098"></a>Lodash Integration
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

## <a name="abbec97b-5fbb-4f1f-90f8-6f1c87a96c0b"></a>Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

### Frequently Used Dev Commands
| Command | Description |
| ---- | ---- |
| npm test | Runs all unit and coverage tests |
| npm run bundle | Transpiles source code to ES5 file, minifys ES5 code to minified file, then builds [README.md][readme-url] file <br> A wrapper for *gulp package* |
| npm run documantation | Builds [DOCUMENTATION.md][documentation-url] file from JSDocs in source file |
| npm run build | Runs all 3 of the following commands: <br><ul><li>npm run documantation</li><li>npm run bundle</li><li>npm test</li></ul> |

### Other Dev Commands
| Command | Description |
| ---- | ---- |
| npm run unit | Runs all unit and coverage tests |
| npm run bowerunit | Runs all unit tests for ES5 and minified ES5 files |
| npm run coverage | Runs coverage tests. ES5 and minified ES5 files are not counted in coverage since it is transpiled by [gulp-babel](https://www.npmjs.com/package/gulp-babel) and assumed to be working code. |
| gulp buildreadme | Builds [README.md][readme-url] file |
| gulp transpile | Transpiles source code to ES5 file |
| gulp minify | Transpiles source code to ES5 file and minifys ES5 code to minified file |
| gulp package | Transpiles source code to ES5 file, minifys ES5 code to minified file, then builds [README.md][readme-url] file |

## <a name="de000503-32bc-40f6-8c03-2a7686e7d18b"></a>Release History
![1.1.0](https://img.shields.io/badge/1.1.0-Add_indexBy_and_uniqify_helpers-green.svg?style=social)<br>![1.0.0](https://img.shields.io/badge/1.0.0-Initial_release-green.svg?style=social)

[Return to Top](#770197a8-5291-4996-b8c8-aa5d9fb94f11)

[license-url]: LICENSE
[npm-url]: https://www.npmjs.com/package/lodash-collection-helpers
[travis-url]: https://travis-ci.org/JSystemsTech/lodash-collection-helpers?branch=release%2F1-1-0
[dependencies-url]: https://david-dm.org/JSystemsTech/lodash-collection-helpers?branch=release%2F1-1-0
[dev-dependencies-url]:https://david-dm.org/JSystemsTech/lodash-collection-helpers?type=dev&branch=release%2F1-1-0
[coverage-url]: https://coveralls.io/repos/github/JSystemsTech/lodash-collection-helpers?branch=release%2F1-1-0
[documentation-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/release/1-1-0/DOCUMENTATION.md
[readme-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/release/1-1-0/README.md
[isCollection-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/release/1-1-0/DOCUMENTATION.md#iscollection
[pickAs-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/release/1-1-0/DOCUMENTATION.md#pickas
[pickAllAs-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/release/1-1-0/DOCUMENTATION.md#pickallas
[select-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/release/1-1-0/DOCUMENTATION.md#select
[selectAll-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/release/1-1-0/DOCUMENTATION.md#selectall
[joinOn-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/release/1-1-0/DOCUMENTATION.md#joinon
[leftJoin-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/release/1-1-0/DOCUMENTATION.md#leftjoin
[rightJoin-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/release/1-1-0/DOCUMENTATION.md#rightjoin
[innerJoin-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/release/1-1-0/DOCUMENTATION.md#innerjoin
[fullJoin-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/release/1-1-0/DOCUMENTATION.md#fulljoin
[leftAntiJoin-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/release/1-1-0/DOCUMENTATION.md#leftantijoin
[rightAntiJoin-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/release/1-1-0/DOCUMENTATION.md#rightantijoin
[fullAntiJoin-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/release/1-1-0/DOCUMENTATION.md#fullantijoin
[getCollectionHelpers-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/release/1-1-0/DOCUMENTATION.md#getcollectionhelpers