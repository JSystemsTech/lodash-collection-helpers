(function(factory) {
    'use strict';
    /* istanbul ignore next */
    // CommonJS
    if (typeof exports == "object" && typeof require == "function") {
        module.exports = factory(require("lodash"));
    }
    // AMD
    else if (typeof define == "function" && define.amd) {
        define(["lodash"], factory);
    }
}(function(_) {
    "use strict";
    const _privateAttributes = new WeakMap();
    class CollectionHelpers {
        constructor() {
            this._instanceId = _.uniqueId('instanceId_');
            _privateAttributes.set(this, {
                _indexBy: function(collection, iteree) {
                    var indexedCollection = {};
                    if (_privateAttributes.get(this)._isCollection(collection)) {
                        _.each(collection, function(item, index) {
                            var indexedKey;
                            if (_.isFunction(iteree)) {
                                indexedKey = iteree(item, index);
                            } else if (_.isString(iteree)) {
                                indexedKey = _.get(item, iteree);
                            }
                            if (!_.isString(indexedKey)) {
                                indexedKey = _.toString(index);
                            }
                            if (_.isPlainObject(_.get(indexedCollection, indexedKey))) {
                                indexedKey = indexedKey + '(' + index + ')';
                            }
                            _.set(indexedCollection, indexedKey, _.cloneDeep(item));
                        });
                    }
                    return indexedCollection;
                },
                _uniqify: function(collection, idAttr, iteree) {
                    if (!_.isString(idAttr) || _.isEmpty(idAttr)) {
                        idAttr = 'uuid';
                    }
                    var cloneCollection = _.cloneDeep(collection);
                    if (_privateAttributes.get(this)._isCollection(cloneCollection)) {
                        _.each(cloneCollection, function(item, index) {
                            var uuidValue = _.uniqueId(idAttr + '_');
                            if (_.isFunction(iteree)) {
                                var calculatedUUID = iteree(item, index);
                                if (_.isString(calculatedUUID)) {
                                    uuidValue = calculatedUUID;
                                }
                            }
                            if (_.isPlainObject(_.find(cloneCollection, _.set({}, idAttr, uuidValue)))) {
                                uuidValue = uuidValue + '(' + index + ')';
                            }
                            _.set(item, idAttr, uuidValue);
                        });
                    }
                    return cloneCollection;
                },
                _isCollection: function(collection) {
                    if (!_.isArray(collection)) {
                        return false;
                    }
                    return _.every(collection, function(item) {
                        return _.isPlainObject(item);
                    });
                },
                _pickAsCore: function(sourceObj, sourceAttrName, dest, destAttrName) {
                    _.set(dest, destAttrName, _.get(sourceObj, sourceAttrName));
                    return dest;
                },
                _pickAsSingleObject: function(sourceObj, sourceMap, pickAll) {
                    if (_.isArray(sourceMap) && !pickAll) {
                        return _.pick(sourceObj, sourceMap);
                    }
                    var dest = {};
                    if (!_.isPlainObject(sourceMap)) {
                        sourceMap = {};
                    }
                    if (!_.isEmpty(sourceMap)) {
                        if (pickAll) {
                            dest = _.omit(sourceObj, _.keys(sourceMap));
                        }
                        _.each(sourceMap, function(destAttrName, sourceAttrName) {
                            this._pickAsCore(sourceObj, sourceAttrName, dest, destAttrName);
                        }.bind(this));
                    } else if (pickAll) {
                        return _.pick(sourceObj, _.keys(sourceObj));
                    }
                    return dest;
                },
                _executePickAs: function(source, sourceMap, pickAll) {
                    if (_.isPlainObject(source)) {
                        return this._pickAsSingleObject(source, sourceMap, pickAll);
                    } else if (this._isCollection(source)) {
                        return _.map(source, function(sourceObj) {
                            return this._pickAsSingleObject(sourceObj, sourceMap, pickAll);
                        }.bind(this));
                    }
                    return source;
                },
                _pickAs: function(source, sourceMap) {
                    return _privateAttributes.get(this)._executePickAs(source, sourceMap, false);
                },
                _pickAllAs: function(source, sourceMap) {
                    return _privateAttributes.get(this)._executePickAs(source, sourceMap, true);
                },
                _executeJoinOn: function(innerJoin, leftCollection, rightCollection, leftIdAttr, rightIdAttr) {
                    var itemsLeftJoined = _.map(leftCollection, function(item) {
                        var sourceObj = _.find(rightCollection, function(rightItem) {
                            return _.get(item, leftIdAttr) === _.get(rightItem, rightIdAttr);
                        });
                        if (innerJoin) {
                            if (_.isPlainObject(sourceObj)) {
                                return _.defaults(_.cloneDeep(item), sourceObj);
                            }
                            return;
                        } else {
                            return _.defaults(_.cloneDeep(item), sourceObj);
                        }
                    });
                    return _.reject(itemsLeftJoined, function(item) {
                        return _.isUndefined(item);
                    });
                },
                _getLeftAntiJoinCollection: function(leftCollection, rightCollection, leftIdAttr, rightIdAttr) {
                    return _.reject(leftCollection, function(item) {
                        var sourceObj = _.find(rightCollection, _.set({}, rightIdAttr, _.get(item, leftIdAttr)));
                        return _.isPlainObject(sourceObj);
                    });
                },
                _executeAntiJoinOn: function(fullAntiJoin, leftCollection, rightCollection, leftIdAttr, rightIdAttr) {
                    var itemsOnlyInLeftCollection = this._getLeftAntiJoinCollection(leftCollection, rightCollection, leftIdAttr, rightIdAttr);
                    if (fullAntiJoin) {
                        var itemsOnlyInRightCollection = this._getLeftAntiJoinCollection(rightCollection, leftCollection, rightIdAttr, leftIdAttr);
                        return itemsOnlyInLeftCollection.concat(itemsOnlyInRightCollection);
                    }
                    return itemsOnlyInLeftCollection;
                },
                _executeFullJoin: function(innerJoin, leftCollection, rightCollection, leftIdAttr, rightIdAttr) {
                    var itemsLeftJoined = this._executeJoinOn(innerJoin, leftCollection, rightCollection, leftIdAttr, rightIdAttr);
                    var itemsOnlyInRightCollection = this._getLeftAntiJoinCollection(rightCollection, leftCollection, rightIdAttr, leftIdAttr);
                    return itemsLeftJoined.concat(itemsOnlyInRightCollection);
                },
                _validateBeforeExecuteJoin: function(executionFunctionName, innerOrFullAntiJoinFlag, leftCollection, rightCollection, leftIdAttr, rightIdAttr) {
                    rightIdAttr = rightIdAttr || leftIdAttr;
                    if (this._isCollection(leftCollection) && this._isCollection(rightCollection)) {
                        return this[executionFunctionName](innerOrFullAntiJoinFlag, leftCollection, rightCollection, leftIdAttr, rightIdAttr);
                    }
                    return [];
                },
                _beforeValidate: function(prependArgs, mainArgs) {
                    return this._validateBeforeExecuteJoin.apply(this, prependArgs.concat(Array.prototype.slice.call(mainArgs)));
                },
                _joinOn: function() {
                    return _privateAttributes.get(this)._beforeValidate(['_executeJoinOn', false], arguments);
                },
                _rightJoin: function(leftCollection, rightCollection, leftIdAttr, rightIdAttr) {
                    var args = [rightCollection, leftCollection, rightIdAttr || leftIdAttr, leftIdAttr];
                    return _privateAttributes.get(this)._beforeValidate(['_executeJoinOn', false], args);
                },
                _innerJoin: function() {
                    return _privateAttributes.get(this)._beforeValidate(['_executeJoinOn', true], arguments);
                },
                _fullJoin: function() {
                    return _privateAttributes.get(this)._beforeValidate(['_executeFullJoin', false], arguments);
                },
                _leftAntiJoin: function() {
                    return _privateAttributes.get(this)._beforeValidate(['_executeAntiJoinOn', false], arguments);
                },
                _rightAntiJoin: function(leftCollection, rightCollection, leftIdAttr, rightIdAttr) {
                    var args = [rightCollection, leftCollection, rightIdAttr || leftIdAttr, leftIdAttr];
                    return _privateAttributes.get(this)._beforeValidate(['_executeAntiJoinOn', false], args);
                },
                _fullAntiJoin: function() {
                    return _privateAttributes.get(this)._beforeValidate(['_executeAntiJoinOn', true], arguments);
                }
            });
            this.indexBy = function() {
                return _privateAttributes.get(this)._indexBy.apply(this, arguments);
            };
            this.uniqify = function() {
                return _privateAttributes.get(this)._uniqify.apply(this, arguments);
            };
            /**
             * This function checks to see if input is an array of plain objects.
             * @since 1.0.0
             * @param [value] input any value or undefined
             * @returns {boolean}
             * @example 
             * collectionHelpers.isCollection('some string')
             * // returns false
             * @example 
             * collectionHelpers.isCollection([])
             * // returns true
             * @example 
             * collectionHelpers.isCollection(['some string'])
             * // returns false
             * @example 
             * collectionHelpers.isCollection([{id:1},{id:2}])
             * // returns true
             */
            this.isCollection = function() {
                return _privateAttributes.get(this)._isCollection.apply(this, arguments);
            };
            /**
             * This function acts similarly to _.pick except it can take a collection or an object source value 
             * and an array of key paths to pick or attribute mapping object to pick source keys as a different key value.
             * @since 1.0.0
             * @param {String|Array} source object or collection
             * @param {Object|Array} attributeMap object of source key => destination key mappings or array of source keys to pick
             * @returns {Object|Array} value returns object with selected keys from attributeMap
             * @example 
             * collectionHelpers.pickAs({id: 'some-id', value: 'Some Value'}, ['id']);
             * // returns {id: 'some-id'}
             * @example 
             * collectionHelpers.pickAs({id: 'some-id', value: 'Some Value'}, {id: 'anotherId'});
             * // returns {anotherId: 'some-id'}
             * @example 
             * collectionHelpers.pickAs({id: 'some-id', value: 'Some Value'}, {id: 'anotherId', value: 'myValue'});
             * // returns {anotherId: 'some-id', myValue: 'Some Value'}
             * @example 
             * collectionHelpers.pickAs(
             *     [{id: 'some-id-1', value: 'Some Value 1'},{id: 'some-id-2', value: 'Some Value 2'}], 
             *     {id: 'anotherId', value: 'myValue'});
             * // returns [{anotherId: 'some-id-1', myValue: 'Some Value 1'},{anotherId: 'some-id-2', myValue: 'Some Value 2'}]
             * @example 
             * collectionHelpers.pickAs({
             *     id: 'some-id', 
             *     value: 'Some Value', 
             *     details: {
             *         other: 'some other Data', 
             *         more: 'more data'
             *     }
             * }, 
             * {id: 'anotherId', 'details.other': 'otherDetails'});
             * // returns {anotherId: 'some-id', otherDetails: 'some other Data'}
             */
            this.pickAs = function() {
                return _privateAttributes.get(this)._pickAs.apply(this, arguments);
            };
            /**
             * Like pickAs except that it picks all keys from the source
             * and will use attribute mapping object accordingly.
             * @since 1.0.0
             * @param {String|Array} source object or collection
             * @param {Object} attributeMap object of source key => destination key mappings or array of source keys to pick
             * @returns {Object|Array} value returns object with selected keys from attributeMap
             * @example 
             * collectionHelpers.pickAllAs({id: 'some-id', value: 'Some Value'}, {id: 'anotherId'});
             * // returns {anotherId: 'some-id', value: 'Some Value'}
             * @example 
             * collectionHelpers.pickAllAs({id: 'some-id', value: 'Some Value'}, {id: 'anotherId', value: 'myValue'});
             * // returns {anotherId: 'some-id', myValue: 'Some Value'}
             * @example 
             * collectionHelpers.pickAllAs(
             *     [{id: 'some-id-1', value: 'Some Value 1'},{id: 'some-id-2', value: 'Some Value 2'}], 
             *     {id: 'anotherId'});
             * // returns [{anotherId: 'some-id-1', value: 'Some Value 1'},{anotherId: 'some-id-2', value: 'Some Value 2'}]
             * @example 
             * collectionHelpers.pickAllAs({
             *     id: 'some-id', 
             *     value: 'Some Value', 
             *     details: {
             *         other: 'some other Data', 
             *         more: 'more data'
             *     }
             * }, 
             * {id: 'anotherId', 'details.other': 'otherDetails'});
             * // returns {
             * //    anotherId: 'some-id', 
             * //    value: 'Some Value',
             * //    otherDetails: 'some other Data', 
             * //    details: { 
             * //        more: 'more data'
             * //    }
             * //}
             * @example 
             * collectionHelpers.pickAllAs({
             *     id: 'some-id', 
             *     value: 'Some Value', 
             *     details: {
             *         other: 'some other Data', 
             *         more: 'more data'
             *     }
             * }, 
             * {id: 'anotherId', 'details.other': 'otherDetails', 'details.more': 'more.data'});
             * // returns {
             * //    anotherId: 'some-id', 
             * //    value: 'Some Value',
             * //    otherDetails: 'some other Data', 
             * //    details: {},
             * //    more: {data: 'more data'}
             * //}
             */
            this.pickAllAs = function() {
                return _privateAttributes.get(this)._pickAllAs.apply(this, arguments);
            };
            /**
             * This function acts similarly to _.pick except it can take a collection or an object source value 
             * and an array of key paths to pick or attribute mapping object to pick source keys as a different key value.
             * @since 1.0.0
             * @alias pickAs
             * @see [pickAs](#pickas)
             * @name select
             * @param {String|Array} source object or collection
             * @param {Object|Array} attributeMap object of source key => destination key mappings or array of source keys to pick
             * @returns {Object|Array} value returns object with selected keys from attributeMap
             * @example 
             * collectionHelpers.select({id: 'some-id', value: 'Some Value'}, ['id']);
             * // returns {id: 'some-id'}
             * @example 
             * collectionHelpers.select({id: 'some-id', value: 'Some Value'}, {id: 'anotherId'});
             * // returns {anotherId: 'some-id'}
             * @example 
             * collectionHelpers.select({id: 'some-id', value: 'Some Value'}, {id: 'anotherId', value: 'myValue'});
             * // returns {anotherId: 'some-id', myValue: 'Some Value'}
             * @example 
             * collectionHelpers.select(
             *     [{id: 'some-id-1', value: 'Some Value 1'},{id: 'some-id-2', value: 'Some Value 2'}], 
             *     {id: 'anotherId', value: 'myValue'});
             * // returns [{anotherId: 'some-id-1', myValue: 'Some Value 1'},{anotherId: 'some-id-2', myValue: 'Some Value 2'}]
             * @example 
             * collectionHelpers.select({
             *     id: 'some-id', 
             *     value: 'Some Value', 
             *     details: {
             *         other: 'some other Data', 
             *         more: 'more data'
             *     }
             * }, 
             * {id: 'anotherId', 'details.other': 'otherDetails'});
             * // returns {anotherId: 'some-id', otherDetails: 'some other Data'}
             */
            this.select = function() {
                return _privateAttributes.get(this)._pickAs.apply(this, arguments);
            };
            /**
             * Like pickAs except that it picks all keys from the source
             * and will use attribute mapping object accordingly.
             * @since 1.0.0
             * @alias pickAllAs
             * @see [pickAllAs](#pickallas)
             * @name selectAll
             * @param {String|Array} source object or collection
             * @param {Object} attributeMap object of source key => destination key mappings or array of source keys to pick
             * @returns {Object|Array} with selected keys from attributeMap
             * @example 
             * collectionHelpers.selectAll({id: 'some-id', value: 'Some Value'}, {id: 'anotherId', value: 'myValue'});
             * // returns {anotherId: 'some-id', myValue: 'Some Value'}
             * @example 
             * collectionHelpers.selectAll(
             *     [{id: 'some-id-1', value: 'Some Value 1'},{id: 'some-id-2', value: 'Some Value 2'}], 
             *     {id: 'anotherId'});
             * // returns [{anotherId: 'some-id-1', value: 'Some Value 1'},{anotherId: 'some-id-2', value: 'Some Value 2'}]
             * @example 
             * collectionHelpers.selectAll({
             *     id: 'some-id', 
             *     value: 'Some Value', 
             *     details: {
             *         other: 'some other Data', 
             *         more: 'more data'
             *     }
             * }, 
             * {id: 'anotherId', 'details.other': 'otherDetails'});
             * // returns {
             * //    anotherId: 'some-id', 
             * //    value: 'Some Value',
             * //    otherDetails: 'some other Data', 
             * //    details: { 
             * //        more: 'more data'
             * //    }
             * //}
             * @example 
             * collectionHelpers.selectAll({
             *     id: 'some-id', 
             *     value: 'Some Value', 
             *     details: {
             *         other: 'some other Data', 
             *         more: 'more data'
             *     }
             * }, 
             * {id: 'anotherId', 'details.other': 'otherDetails', 'details.more': 'more.data'});
             * // returns {
             * //    anotherId: 'some-id', 
             * //    value: 'Some Value',
             * //    otherDetails: 'some other Data', 
             * //    details: {},
             * //    more: {data: 'more data'}
             * //}
             */
            this.selectAll = function() {
                return _privateAttributes.get(this)._pickAllAs.apply(this, arguments);
            };
            /**
             * Merges matched data from two collections from matching id values and returns
             * the union of the left collection and the intersection of data that exist in both collections
             *
             * ![joinOn](https://github.com/JSystemsTech/lodash-collection-helpers/raw/master/documentation-images/leftJoin.png)
             *
             * @since 1.0.0
             * @param {Array} leftCollection collection to join into from rightCollection
             * @param {Array} rightCollection collection to join into leftCollection
             * @param {String} leftIdAttr leftCollection attribute name to use for comparing match values
             * @param {String} [rightIdAttr=leftIdAttr] rightCollection attribute name to use for comparing match values
             * @returns {Array} Returns `collection` of merged data where data id attributes are matched
             * @example
             * var leftCollection = [{id: 'some-id-1', value: 'Some Value 1'},{id: 'some-id-2', value: 'Some Value 2'}];
             * var rightCollection = [{id: 'some-id-1', other: 'Other Value 1'}];
             * var leftIdAttr = 'id';
             * collectionHelpers.joinOn(leftCollection, rightCollection, leftIdAttr);
             * //returns [{id: 'some-id-1', value: 'Some Value 1', other: 'Other Value 1'},{id: 'some-id-2', value: 'Some Value 2'}]
             * @example
             * var leftCollection = [{id: 'some-id-1', value: 'Some Value 1'},{id: 'some-id-2', value: 'Some Value 2'}];
             * var rightCollection = [{rightId: 'some-id-1', other: 'Other Value 1'}];
             * var leftIdAttr = 'id';
             * var rightIdAttr = 'rightId';
             * collectionHelpers.joinOn(leftCollection, rightCollection, leftIdAttr, rightIdAttr);
             * //returns [{id: 'some-id-1', value: 'Some Value 1', other: 'Other Value 1'},{id: 'some-id-2', value: 'Some Value 2'}]
             */
            this.joinOn = function() {
                return _privateAttributes.get(this)._joinOn.apply(this, arguments);
            };
            /**
             * Merges matched data from two collections from matching id values and returns
             * the union of the left collection and the intersection of data that exist in both collections
             *
             * ![leftJoin](https://github.com/JSystemsTech/lodash-collection-helpers/raw/master/documentation-images/leftJoin.png)
             *
             * @since 1.0.0
             * @alias joinOn
             * @see [joinOn](#joinon)
             * @name leftJoin
             * @param {Array} leftCollection collection to join into from rightCollection
             * @param {Array} rightCollection collection to join into leftCollection
             * @param {String} leftIdAttr leftCollection attribute name to use for comparing match values
             * @param {String} [rightIdAttr=leftIdAttr] rightCollection attribute name to use for comparing match values
             * @returns {Array} Returns `collection` of merged data where data id attributes are matched
             * @example
             * var leftCollection = [{id: 'some-id-1', value: 'Some Value 1'},{id: 'some-id-2', value: 'Some Value 2'}];
             * var rightCollection = [{id: 'some-id-1', other: 'Other Value 1'}];
             * var leftIdAttr = 'id';
             * collectionHelpers.leftJoin(leftCollection, rightCollection, leftIdAttr);
             * //returns [{id: 'some-id-1', value: 'Some Value 1', other: 'Other Value 1'},{id: 'some-id-2', value: 'Some Value 2'}]
             * @example
             * var leftCollection = [{id: 'some-id-1', value: 'Some Value 1'},{id: 'some-id-2', value: 'Some Value 2'}];
             * var rightCollection = [{rightId: 'some-id-1', other: 'Other Value 1'}];
             * var leftIdAttr = 'id';
             * var rightIdAttr = 'rightId';
             * collectionHelpers.leftJoin(leftCollection, rightCollection, leftIdAttr, rightIdAttr);
             * //returns [{id: 'some-id-1', value: 'Some Value 1', other: 'Other Value 1'},{id: 'some-id-2', value: 'Some Value 2'}]
             */
            this.leftJoin = function() {
                return _privateAttributes.get(this)._joinOn.apply(this, arguments);
            };
            /**
             * Merges matched data from two collections from matching id values and returns
             * the union of the right collection and the intersection of data that exist in both collections
             *
             * ![rightJoin](https://github.com/JSystemsTech/lodash-collection-helpers/raw/master/documentation-images/rightJoin.png)
             *
             * @since 1.0.0
             * @param {Array} leftCollection collection to join into rightCollection
             * @param {Array} rightCollection collection to join into from leftCollection
             * @param {String} leftIdAttr leftCollection attribute name to use for comparing match values
             * @param {String} [rightIdAttr=leftIdAttr] rightCollection attribute name to use for comparing match values
             * @returns {Array} Returns `collection` of merged data where data id attributes are matched
             * @example
             * var leftCollection = [{id: 'some-id-1', other: 'Other Value 1'}];
             * var rightCollection = [{id: 'some-id-1', value: 'Some Value 1'},{id: 'some-id-2', value: 'Some Value 2'}];
             * var leftIdAttr = 'id';
             * collectionHelpers.rightJoin(leftCollection, rightCollection, leftIdAttr);
             * //returns [{id: 'some-id-1', value: 'Some Value 1', other: 'Other Value 1'},{id: 'some-id-2', value: 'Some Value 2'}]
             * @example
             * var leftCollection = [{id: 'some-id-1', other: 'Other Value 1'}];
             * var rightCollection = [{rightId: 'some-id-1', value: 'Some Value 1'},{rightId: 'some-id-2', value: 'Some Value 2'}];
             * var leftIdAttr = 'id';
             * var rightIdAttr = 'rightId';
             * collectionHelpers.rightJoin(leftCollection, rightCollection, leftIdAttr, rightIdAttr);
             * //returns [{rightId: 'some-id-1', value: 'Some Value 1', other: 'Other Value 1'},{rightId: 'some-id-2', value: 'Some Value 2'}]
             */
            this.rightJoin = function() {
                return _privateAttributes.get(this)._rightJoin.apply(this, arguments);
            };
            /**
             * Merges matched data from two collections from matching id values and returns
             * the intersection of data that exist in both collections 
             *
             * ![innerJoin](https://github.com/JSystemsTech/lodash-collection-helpers/raw/master/documentation-images/innerJoin.png)
             *
             * @since 1.0.0
             * @param {Array} leftCollection collection to match in rightCollection
             * @param {Array} rightCollection collection to match in leftCollection
             * @param {String} leftIdAttr leftCollection attribute name to use for comparing match values
             * @param {String} [rightIdAttr=leftIdAttr] rightCollection attribute name to use for comparing match values
             * @returns {Array} Returns `collection` of merged data where data id attributes are matched
             * @example
             * var leftCollection = [{id: 'some-id-1', other: 'Other Value 1'},{id: 'shared', other: 'Shared other'}];
             * var rightCollection = [{id: 'shared', value: 'Shared Value'},{id: 'some-id-2', value: 'Some Value 2'}];
             * var leftIdAttr = 'id';
             * collectionHelpers.innerJoin(leftCollection, rightCollection, leftIdAttr);
             * //returns [{id: 'shared', value: 'Shared Value', other: 'Shared other'}]
             * @example
             * var leftCollection = [{id: 'some-id-1', other: 'Other Value 1'},{id: 'shared', other: 'Shared other'}];
             * var rightCollection = [{rightId: 'shared', value: 'Shared Value'},{rightId: 'some-id-2', value: 'Some Value 2'}];
             * var leftIdAttr = 'id';
             * var rightIdAttr = 'rightId';
             * collectionHelpers.innerJoin(leftCollection, rightCollection, leftIdAttr);
             * //returns [{id: 'shared', value: 'Shared Value', other: 'Shared other'}]
             */
            this.innerJoin = function() {
                return _privateAttributes.get(this)._innerJoin.apply(this, arguments);
            };
            /**
             * Merges data from two collections from matching id values and returns
             * the union of both collections
             *
             * ![fullJoin](https://github.com/JSystemsTech/lodash-collection-helpers/raw/master/documentation-images/fullJoin.png)
             *
             * @since 1.0.0
             * @param {Array} leftCollection collection to match in rightCollection
             * @param {Array} rightCollection collection to match in leftCollection
             * @param {String} leftIdAttr leftCollection attribute name to use for comparing match values
             * @param {String} [rightIdAttr=leftIdAttr] rightCollection attribute name to use for comparing match values
             * @returns {Array} Returns `collection` of merged data where data id attributes are matched
             * @example
             * var leftCollection = [{id: 'some-id-1', other: 'Other Value 1'},{id: 'shared', other: 'Shared other'}];
             * var rightCollection = [{id: 'shared', value: 'Shared Value'},{id: 'some-id-2', value: 'Some Value 2'}];
             * var leftIdAttr = 'id';
             * collectionHelpers.fullJoin(leftCollection, rightCollection, leftIdAttr);
             * //returns [{id: 'some-id-1', other: 'Other Value 1'},
             * // {id: 'shared', value: 'Shared Value', other: 'Shared other'},
             * // {rightId: 'some-id-2', value: 'Some Value 2'}]
             * @example
             * var leftCollection = [{id: 'some-id-1', other: 'Other Value 1'},{id: 'shared', other: 'Shared other'}];
             * var rightCollection = [{rightId: 'shared', value: 'Shared Value'},{rightId: 'some-id-2', value: 'Some Value 2'}];
             * var leftIdAttr = 'id';
             * var rightIdAttr = 'rightId';
             * collectionHelpers.fullJoin(leftCollection, rightCollection, leftIdAttr);
             * //returns [{id: 'some-id-1', other: 'Other Value 1'},
             * // {id: 'shared', value: 'Shared Value', other: 'Shared other'},
             * // {rightId: 'some-id-2', value: 'Some Value 2'}]
             */
            this.fullJoin = function() {
                return _privateAttributes.get(this)._fullJoin.apply(this, arguments);
            };
            /**
             * Takes two collections and returns data from the left collection  
             * without the data from the intersection of data that exist in both collections
             * based on matching id values.
             *
             * ![leftAntiJoin](https://github.com/JSystemsTech/lodash-collection-helpers/raw/master/documentation-images/leftAntiJoin.png)
             *
             * @since 1.0.0
             * @param {Array} leftCollection collection to match in rightCollection
             * @param {Array} rightCollection collection to match in leftCollection
             * @param {String} leftIdAttr leftCollection attribute name to use for comparing match values
             * @param {String} [rightIdAttr=leftIdAttr] rightCollection attribute name to use for comparing match values
             * @returns {Array} Returns `collection` of merged data where data id attributes are matched
             * @example
             * var leftCollection = [{id: 'some-id-1', other: 'Other Value 1'},{id: 'shared', other: 'Shared other'}];
             * var rightCollection = [{id: 'shared', value: 'Shared Value'},{id: 'some-id-2', value: 'Some Value 2'}];
             * var leftIdAttr = 'id';
             * collectionHelpers.leftAntiJoin(leftCollection, rightCollection, leftIdAttr);
             * //returns [{id: 'some-id-1', other: 'Other Value 1'}]
             * @example
             * var leftCollection = [{id: 'some-id-1', other: 'Other Value 1'},{id: 'shared', other: 'Shared other'}];
             * var rightCollection = [{rightId: 'shared', value: 'Shared Value'},{rightId: 'some-id-2', value: 'Some Value 2'}];
             * var leftIdAttr = 'id';
             * var rightIdAttr = 'rightId';
             * collectionHelpers.leftAntiJoin(leftCollection, rightCollection, leftIdAttr);
             * //returns [{id: 'some-id-1', other: 'Other Value 1'}]
             */
            this.leftAntiJoin = function() {
                return _privateAttributes.get(this)._leftAntiJoin.apply(this, arguments);
            };
            /**
             * Takes two collections and returns data from the right collection  
             * without the data from the intersection of data that exist in both collections
             * based on matching id values.
             *
             * ![rightAntiJoin](https://github.com/JSystemsTech/lodash-collection-helpers/raw/master/documentation-images/rightAntiJoin.png)
             *
             * @since 1.0.0
             * @param {Array} leftCollection collection to match in rightCollection
             * @param {Array} rightCollection collection to match in leftCollection
             * @param {String} leftIdAttr leftCollection attribute name to use for comparing match values
             * @param {String} [rightIdAttr=leftIdAttr] rightCollection attribute name to use for comparing match values
             * @returns {Array} Returns `collection` of merged data where data id attributes are matched
             * @example
             * var leftCollection = [{id: 'some-id-1', other: 'Other Value 1'},{id: 'shared', other: 'Shared other'}];
             * var rightCollection = [{id: 'shared', value: 'Shared Value'},{id: 'some-id-2', value: 'Some Value 2'}];
             * var leftIdAttr = 'id';
             * collectionHelpers.rightAntiJoin(leftCollection, rightCollection, leftIdAttr);
             * //returns [{rightId: 'some-id-2', value: 'Some Value 2'}]
             * @example
             * var leftCollection = [{id: 'some-id-1', other: 'Other Value 1'},{id: 'shared', other: 'Shared other'}];
             * var rightCollection = [{rightId: 'shared', value: 'Shared Value'},{rightId: 'some-id-2', value: 'Some Value 2'}];
             * var leftIdAttr = 'id';
             * var rightIdAttr = 'rightId';
             * collectionHelpers.rightAntiJoin(leftCollection, rightCollection, leftIdAttr);
             * //returns [{rightId: 'some-id-2', value: 'Some Value 2'}]
             */
            this.rightAntiJoin = function() {
                return _privateAttributes.get(this)._rightAntiJoin.apply(this, arguments);
            };
            /**
             * Takes two collections and returns the union of data from both collections  
             * without the data from the intersection of data that exist in both collections
             * based on matching id values.
             *
             * ![fullAntiJoin](https://github.com/JSystemsTech/lodash-collection-helpers/raw/master/documentation-images/fullAntiJoin.png)
             *
             * @since 1.0.0
             * @param {Array} leftCollection collection to match in rightCollection
             * @param {Array} rightCollection collection to match in leftCollection
             * @param {String} leftIdAttr leftCollection attribute name to use for comparing match values
             * @param {String} [rightIdAttr=leftIdAttr] rightCollection attribute name to use for comparing match values
             * @returns {Array} Returns `collection` of merged data where data id attributes are matched
             * @example
             * var leftCollection = [{id: 'some-id-1', other: 'Other Value 1'},{id: 'shared', other: 'Shared other'}];
             * var rightCollection = [{id: 'shared', value: 'Shared Value'},{id: 'some-id-2', value: 'Some Value 2'}];
             * var leftIdAttr = 'id';
             * collectionHelpers.fullAntiJoin(leftCollection, rightCollection, leftIdAttr);
             * //returns [{id: 'some-id-1', other: 'Other Value 1'},{id: 'some-id-2', value: 'Some Value 2'}]
             * @example
             * var leftCollection = [{id: 'some-id-1', other: 'Other Value 1'},{id: 'shared', other: 'Shared other'}];
             * var rightCollection = [{rightId: 'shared', value: 'Shared Value'},{rightId: 'some-id-2', value: 'Some Value 2'}];
             * var leftIdAttr = 'id';
             * var rightIdAttr = 'rightId';
             * collectionHelpers.fullAntiJoin(leftCollection, rightCollection, leftIdAttr);
             * //returns [{id: 'some-id-1', other: 'Other Value 1'},{rightId: 'some-id-2', value: 'Some Value 2'}]
             */
            this.fullAntiJoin = function() {
                return _privateAttributes.get(this)._fullAntiJoin.apply(this, arguments);
            };
            /**
             * Function that returns the following list of collection helper
             * functions in this library.
             *
             *-    [pickAs](#pickas)
             *-    [pickAllAs](#pickallas)
             *-    [select](#select)
             *-    [selectAll](#selectall)
             *-    [joinOn](#joinon)
             *-    [leftJoin](#leftjoin)
             *-    [rightJoin](#rightjoin)
             *-    [innerJoin](#innerjoin)
             *-    [fullJoin](#fulljoin)
             *-    [leftAntiJoin](#leftantijoin)
             *-    [rightAntiJoin](#rightantijoin)
             *-    [fullAntiJoin](#fullantijoin)
             *
             * @since 1.0.0
             * @returns {Object}
             */
            this.getCollectionHelpers = function() {
                var collectionHelpers = _privateAttributes.get(this);
                return {
                    isCollection: collectionHelpers._isCollection.bind(this),
                    pickAs: collectionHelpers._pickAs.bind(this),
                    pickAllAs: collectionHelpers._pickAllAs.bind(this),
                    select: collectionHelpers._pickAs.bind(this),
                    selectAll: collectionHelpers._pickAllAs.bind(this),
                    joinOn: collectionHelpers._joinOn.bind(this),
                    leftJoin: collectionHelpers._joinOn.bind(this),
                    rightJoin: collectionHelpers._rightJoin.bind(this),
                    innerJoin: collectionHelpers._innerJoin.bind(this),
                    fullJoin: collectionHelpers._fullJoin.bind(this),
                    leftAntiJoin: collectionHelpers._leftAntiJoin.bind(this),
                    rightAntiJoin: collectionHelpers._rightAntiJoin.bind(this),
                    fullAntiJoin: collectionHelpers._fullAntiJoin.bind(this),
                    indexBy: collectionHelpers._indexBy.bind(this),
                    uniqify: collectionHelpers._uniqify.bind(this)
                };
            };
        }
    }
    return new CollectionHelpers();
}));