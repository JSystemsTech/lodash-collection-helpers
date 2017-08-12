'use strict';
var _ = require('lodash'),
	expect = require('must'),
	lodashCollectionHelpers = require('./lodash-collection-helpers'),
	bankUserInfoData = require('../test/bankUserInfo'),
	userInfoData = require('../test/userInfo'),
	fullNameInfoData = require('../test/fullNameInfo'),
	workInfoData = require('../test/workInfo');
_.mixin(lodashCollectionHelpers.getCollectionHelpers());

describe('Testing Lodash Collection Helpers when integrated with the main _ object', function() {
	/*code*/
});