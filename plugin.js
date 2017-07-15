define([
    'lodash',
    'uuid'
], function(_, uuid) {
    "use strict";
    const _privateAttributes = new WeakMap();
    class CollectionHelpers {
        constructor() {
            this.id = uuid.v4();
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
                    if (_.isArray(sourceMap)) {
                        return _.pick(sourceObj, sourceMap);
                    }
                    var dest = {};
                    if (pickAll) {
                        dest = _.omit(sourceObj, _.keys(sourceMap));
                    }
                    _.each(sourceMap, function(destAttrName, sourceAttrName) {
                        this._pickAsCore(sourceObj, sourceAttrName, dest, destAttrName);
                    }.bind(this));
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
                    return this._executePickAs(source, sourceMap, false);
                },
                _pickAllAs: function(source, sourceMap) {
                    return this._executePickAs(source, sourceMap, true);
                },
                _executeJoinOn: function(innerJoin, destCollection, sourceCollection, destIdAttr, sourceIdAttr) {
                    var finalDestCollection = [];
                    sourceIdAttr = sourceIdAttr || destIdAttr;
                    if (this._isCollection(destCollection) && this._isCollection(sourceCollection)) {
                        _.each(destCollection, function(item) {
                            var sourceObj = _.find(sourceCollection, _.set({}, sourceIdAttr, _.get(item, destIdAttr)));
                            if (innerJoin) {
                                if (_.isPlainObject(sourceObj)) {
                                    finalDestCollection.push(_.defaults(item, sourceObj));
                                }
                            } else {
                                finalDestCollection.push(_.defaults(item, sourceObj));
                            }
                        });
                    }
                    return finalDestCollection;
                },
                _joinOn: function(destCollection, sourceCollection, destIdAttr, sourceIdAttr) {
                    return this._executeJoinOn(false, destCollection, sourceCollection, destIdAttr, sourceIdAttr);
                },
                _rightJoin: function(destCollection, sourceCollection, destIdAttr, sourceIdAttr) {
                    return this._executeJoinOn(false, sourceCollection, destCollection, sourceIdAttr || destIdAttr, destIdAttr);
                },
                _innerJoin: function(destCollection, sourceCollection, destIdAttr, sourceIdAttr) {
                    return this._executeJoinOn(true, destCollection, sourceCollection, destIdAttr, sourceIdAttr);
                },
                _fullJoin: function(destCollection, sourceCollection, destIdAttr, sourceIdAttr) {
                    if (!this._isCollection(destCollection) || !this._isCollection(sourceCollection)) {
                        return [];
                    }
                    sourceIdAttr = sourceIdAttr || destIdAttr;
                    var finalDestCollection = this._executeJoinOn(false, destCollection, sourceCollection, destIdAttr, sourceIdAttr);
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
        isCollection(collection) {
            return _privateAttributes.get(this)._isCollection(collection);
        }
        pickAs(source, sourceMap) {
            return _privateAttributes.get(this)._pickAs(source, sourceMap);
        }
        pickAllAs(source, sourceMap) {
            return _privateAttributes.get(this)._pickAllAs(source, sourceMap);
        }
        select(source, sourceMap) {
            return _privateAttributes.get(this)._pickAs(source, sourceMap);
        }
        selectAll(source, sourceMap) {
            return _privateAttributes.get(this)._pickAllAs(source, sourceMap);
        }
        joinOn(destCollection, sourceCollection, destIdAttr, sourceIdAttr) {
            return _privateAttributes.get(this)._joinOn(destCollection, sourceCollection, destIdAttr, sourceIdAttr);
        }
        leftJoin(destCollection, sourceCollection, destIdAttr, sourceIdAttr) {
            return _privateAttributes.get(this)._joinOn(destCollection, sourceCollection, destIdAttr, sourceIdAttr);
        }
        rightJoin(destCollection, sourceCollection, destIdAttr, sourceIdAttr) {
            return _privateAttributes.get(this)._rightJoin(destCollection, sourceCollection, destIdAttr, sourceIdAttr);
        }
        innerJoin(destCollection, sourceCollection, destIdAttr, sourceIdAttr) {
            return _privateAttributes.get(this)._innerJoin(destCollection, sourceCollection, destIdAttr, sourceIdAttr);
        }
        fullJoin(destCollection, sourceCollection, destIdAttr, sourceIdAttr) {
            return _privateAttributes.get(this)._fullJoin(destCollection, sourceCollection, destIdAttr, sourceIdAttr);
        }
    }

    return new CollectionHelpers();
});
