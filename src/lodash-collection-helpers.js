(function(factory) {
    'use strict';
    /* istanbul ignore next */
    // CommonJS
    if (typeof exports == "object" && typeof require == "function") {
        module.exports = factory(require("lodash"), require("uuid"));
    }
    // AMD
    else if (typeof define == "function" && define.amd) {
        define(["lodash", "backbone"], factory);
    }
}(function(_, uuid) {
    "use strict";
    const _privateAttributes = new WeakMap();
    class CollectionHelpers {
        constructor() {
            this._instanceId = uuid.v4();
            _privateAttributes.set(this, {
                _isCollection: function(collection) {
                    if (!_.isArray(collection)) {
                        return false;
                    }
                    var isCollection = true;
                    _.each(collection, function(item) {
                        isCollection = isCollection && _.isPlainObject(item);
                    });
                    return isCollection;
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
                        var sourceObj = _.find(rightCollection, _.set({}, rightIdAttr, _.get(item, leftIdAttr)));
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
            /**
             * This function checks to see if input is an array of plain objects.
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
             * @param {String|Array} source object or collection
             * @param {Object|Array} attributeMap object of source key => destination key mappings or array of source keys to pick
             * @returns {Object|Array} value returns object with selected keys from attributeMap
             */
            this.pickAs = function() {
                return _privateAttributes.get(this)._pickAs.apply(this, arguments);
            };
            /**
             * Like pickAs except that it picks all keys from the source
             * and will use attribute mapping object accordingly.
             * @param {String|Array} source object or collection
             * @param {Object} attributeMap object of source key => destination key mappings or array of source keys to pick
             * @returns {Object|Array} value returns object with selected keys from attributeMap
             */
            this.pickAllAs = function() {
                return _privateAttributes.get(this)._pickAllAs.apply(this, arguments);
            };
            /**
             * This function acts similarly to _.pick except it can take a collection or an object source value 
             * and an array of key paths to pick or attribute mapping object to pick source keys as a different key value.
             *
             * alias: [pickAs](#pickas)
             *
             * @param {String|Array} source object or collection
             * @param {Object|Array} attributeMap object of source key => destination key mappings or array of source keys to pick
             * @returns {Object|Array} value returns object with selected keys from attributeMap
             */
            this.select = function() {
                return _privateAttributes.get(this)._pickAs.apply(this, arguments);
            };
            /**
             * Like pickAs except that it picks all keys from the source
             * and will use attribute mapping object accordingly.
             *
             * alias: [pickAllAs](#pickallas)
             *
             * @param {String|Array} source object or collection
             * @param {Object} attributeMap object of source key => destination key mappings or array of source keys to pick
             * @returns {Object|Array} value returns object with selected keys from attributeMap
             */
            this.selectAll = function() {
                return _privateAttributes.get(this)._pickAllAs.apply(this, arguments);
            };
            this.joinOn = function() {
                return _privateAttributes.get(this)._joinOn.apply(this, arguments);
            };
            this.leftJoin = function() {
                return _privateAttributes.get(this)._joinOn.apply(this, arguments);
            };
            this.rightJoin = function() {
                return _privateAttributes.get(this)._rightJoin.apply(this, arguments);
            };
            this.innerJoin = function() {
                return _privateAttributes.get(this)._innerJoin.apply(this, arguments);
            };
            this.fullJoin = function() {
                return _privateAttributes.get(this)._fullJoin.apply(this, arguments);
            };
            this.leftAntiJoin = function() {
                return _privateAttributes.get(this)._leftAntiJoin.apply(this, arguments);
            };
            this.rightAntiJoin = function() {
                return _privateAttributes.get(this)._rightAntiJoin.apply(this, arguments);
            };
            this.fullAntiJoin = function() {
                return _privateAttributes.get(this)._fullAntiJoin.apply(this, arguments);
            };
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
                    fullAntiJoin: collectionHelpers._fullAntiJoin.bind(this)
                };
            };
        }
    }
    return new CollectionHelpers();
}));