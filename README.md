[![NPM version](http://img.shields.io/npm/v/lodash-collection-helpers.svg?style=flat)][npm-url] [![NPM downloads](http://img.shields.io/npm/dm/lodash-collection-helpers.svg?style=flat)][npm-url] [![Build Status](https://travis-ci.org/JSystemsTech/lodash-collection-helpers.svg?branch=release%2F1-1-0)][travis-url] [![Coverage Status](https://coveralls.io/repos/github/JSystemsTech/lodash-collection-helpers/badge.svg?branch=release%2F1-1-0)][coverage-url] [![Dependency Status](https://david-dm.org/JSystemsTech/lodash-collection-helpers.svg?style=flat&branch=release%2F1-1-0)][dependencies-url] [![devDependencies Status](https://david-dm.org/JSystemsTech/lodash-collection-helpers/dev-status.svg?branch=release%2F1-1-0)][dev-dependencies-url] [![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)][license-url] <a href="https://github.com/JSystemsTech/lodash-collection-helpers#README"><img src="https://github.com/JSystemsTech/lodash-collection-helpers/raw/release/1-1-0/gulpCustomPlugins/customBadges/bower-badge.png" alt="Bower Package" height="30" width="130"></a>
## <a name="be1d5164-3206-4461-8f89-8f64ddf25e25"></a>Table of Contents
1. [Installation](#8ed2455b-8c29-4fbc-a366-19f250cfe760)
2. [Usage](#1fa5b9ac-27b6-41ec-9bd9-ec27fc33b606)
3. [Lodash Integration](#f7d258bf-41eb-45c0-b3d2-b347b2db18e7)
4. [Contributing](#50a5fb28-4a71-4112-a865-dd79f848897b)
5. [Release History](#055b4d4d-309a-41bf-bf39-8bbf72708f64)

## <a name="8ed2455b-8c29-4fbc-a366-19f250cfe760"></a>Installation
| Installation Type | Command |
| :----: | ---- |
| npm | npm install lodash-collection-helpers --save |
| bower | bower install lodash-collection-helpers |
| yarn | yarn add lodash-collection-helpers |

## <a name="1fa5b9ac-27b6-41ec-9bd9-ec27fc33b606"></a>Usage
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

## <a name="f7d258bf-41eb-45c0-b3d2-b347b2db18e7"></a>Lodash Integration
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

## <a name="50a5fb28-4a71-4112-a865-dd79f848897b"></a>Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## <a name="055b4d4d-309a-41bf-bf39-8bbf72708f64"></a>Release History
![1.1.0](https://img.shields.io/badge/1.1.0-Add_indexBy_and_uniqify_helpers-green.svg?style=social)<br>![1.0.0](https://img.shields.io/badge/1.0.0-Initial_release-green.svg?style=social)

[Return to Top](#be1d5164-3206-4461-8f89-8f64ddf25e25)

[license-url]: LICENSE
[npm-url]: https://www.npmjs.com/package/lodash-collection-helpers
[travis-url]: https://travis-ci.org/JSystemsTech/lodash-collection-helpers?branch=release%2F1-1-0
[dependencies-url]: https://david-dm.org/JSystemsTech/lodash-collection-helpers?branch=release%2F1-1-0
[dev-dependencies-url]:https://david-dm.org/JSystemsTech/lodash-collection-helpers?type=dev&branch=release%2F1-1-0
[coverage-url]: https://coveralls.io/repos/github/JSystemsTech/lodash-collection-helpers?branch=release%2F1-1-0
[documentation-url]: https://github.com/JSystemsTech/lodash-collection-helpers/blob/release/1-1-0/DOCUMENTATION.md
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