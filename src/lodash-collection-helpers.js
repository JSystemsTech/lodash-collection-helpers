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
                        var dest = [];
                        _.each(source, function(sourceObj) {
                            dest.push(this._pickAsSingleObject(sourceObj, sourceMap, pickAll));
                        }.bind(this));
                        return dest;
                    }
                    return source;
                },
                _pickAs: function(source, sourceMap) {
                    return _privateAttributes.get(this)._executePickAs(source, sourceMap, false);
                },
                _pickAllAs: function(source, sourceMap) {
                    return _privateAttributes.get(this)._executePickAs(source, sourceMap, true);
                },
                _executeJoinOn: function(innerJoin, destCollection, sourceCollection, destIdAttr, sourceIdAttr) {
                    var finalDestCollection = [];
                    sourceIdAttr = sourceIdAttr || destIdAttr;
                    if (this._isCollection(destCollection) && this._isCollection(sourceCollection)) {
                        _.each(destCollection, function(item) {
                            var sourceObj = _.find(sourceCollection, _.set({}, sourceIdAttr, _.get(item, destIdAttr)));
                            if (innerJoin) {
                                if (_.isPlainObject(sourceObj)) {
                                    finalDestCollection.push(_.defaults(_.cloneDeep(item), sourceObj));
                                }
                            } else {
                                finalDestCollection.push(_.defaults(_.cloneDeep(item), sourceObj));
                            }
                        });
                    }
                    return finalDestCollection;
                },
                _joinOn: function(destCollection, sourceCollection, destIdAttr, sourceIdAttr) {
                    return _privateAttributes.get(this)._executeJoinOn(false, destCollection, sourceCollection, destIdAttr, sourceIdAttr);
                },
                _rightJoin: function(destCollection, sourceCollection, destIdAttr, sourceIdAttr) {
                    return _privateAttributes.get(this)._executeJoinOn(false, sourceCollection, destCollection, sourceIdAttr || destIdAttr, destIdAttr);
                },
                _innerJoin: function(destCollection, sourceCollection, destIdAttr, sourceIdAttr) {
                    return _privateAttributes.get(this)._executeJoinOn(true, destCollection, sourceCollection, destIdAttr, sourceIdAttr);
                },
                _fullJoin: function(destCollection, sourceCollection, destIdAttr, sourceIdAttr) {
                    if (!_privateAttributes.get(this)._isCollection(destCollection) || 
                        !_privateAttributes.get(this)._isCollection(sourceCollection)) {
                        return [];
                    }
                    sourceIdAttr = sourceIdAttr || destIdAttr;
                    var finalDestCollection = _privateAttributes.get(this)._executeJoinOn(false, destCollection, sourceCollection, destIdAttr, sourceIdAttr);
                    _.each(sourceCollection, function(item) {
                        var destObj = _.find(finalDestCollection, _.set({}, destIdAttr, _.get(item, sourceIdAttr)));
                        if (!_.isPlainObject(destObj)) {
                            finalDestCollection.push(item);
                        }
                    });
                    return finalDestCollection;
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
            return {
                isCollection: _privateAttributes.get(this)._isCollection.bind(this),
                pickAs: _privateAttributes.get(this)._pickAs.bind(this),
                pickAllAs: _privateAttributes.get(this)._pickAllAs.bind(this),
                select: _privateAttributes.get(this)._pickAs.bind(this),
                selectAll: _privateAttributes.get(this)._pickAllAs.bind(this),
                joinOn: _privateAttributes.get(this)._joinOn.bind(this),
                leftJoin: _privateAttributes.get(this)._joinOn.bind(this),
                rightJoin: _privateAttributes.get(this)._rightJoin.bind(this),
                innerJoin: _privateAttributes.get(this)._innerJoin.bind(this),
                fullJoin: _privateAttributes.get(this)._fullJoin.bind(this)
            };
        }
    }

    return new CollectionHelpers();
}));