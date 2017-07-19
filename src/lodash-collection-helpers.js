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
                    return this._validateBeforeExecuteJoin.apply(this, prependArgs.concat(Array.prototype.slice.call(mainArgs)))
                },
                _joinOn: function() {
                    return _privateAttributes.get(this)._beforeValidate(['_executeJoinOn', false], arguments);
                },
                _rightJoin: function(destCollection, sourceCollection, destIdAttr, sourceIdAttr) {
                    var args = [sourceCollection, destCollection, sourceIdAttr || destIdAttr, destIdAttr];
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
                _rightAntiJoin: function(destCollection, sourceCollection, destIdAttr, sourceIdAttr) {
                    var args = [sourceCollection, destCollection, sourceIdAttr || destIdAttr, destIdAttr];
                    return _privateAttributes.get(this)._beforeValidate(['_executeAntiJoinOn', false], args);
                },
                _fullAntiJoin: function() {
                    return _privateAttributes.get(this)._beforeValidate(['_executeAntiJoinOn', true], arguments);
                }
            });
        }
        isCollection() {
            return _privateAttributes.get(this)._isCollection.apply(this, arguments);
        }
        pickAs() {
            return _privateAttributes.get(this)._pickAs.apply(this, arguments);
        }
        pickAllAs() {
            return _privateAttributes.get(this)._pickAllAs.apply(this, arguments);
        }
        select() {
            return _privateAttributes.get(this)._pickAs.apply(this, arguments);
        }
        selectAll() {
            return _privateAttributes.get(this)._pickAllAs.apply(this, arguments);
        }
        joinOn() {
            return _privateAttributes.get(this)._joinOn.apply(this, arguments);
        }
        leftJoin() {
            return _privateAttributes.get(this)._joinOn.apply(this, arguments);
        }
        rightJoin() {
            return _privateAttributes.get(this)._rightJoin.apply(this, arguments);
        }
        innerJoin() {
            return _privateAttributes.get(this)._innerJoin.apply(this, arguments);
        }
        fullJoin() {
            return _privateAttributes.get(this)._fullJoin.apply(this, arguments);
        }
        getCollectionHelpers() {
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
                fullJoin: collectionHelpers._fullJoin.bind(this)
            };
        }
    }

    return new CollectionHelpers();
}));