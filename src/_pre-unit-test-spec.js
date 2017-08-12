'use strict';
var _ = require('lodash'),
	expect = require('must'),
	lodashCollectionHelpers = require('./lodash-collection-helpers'),
	bankUserInfoData = require('../test/bankUserInfo'),
	userInfoData = require('../test/userInfo'),
	fullNameInfoData = require('../test/fullNameInfo'),
	workInfoData = require('../test/workInfo');

describe('Testing getCollectionHelpers', function() {
	var helpers = lodashCollectionHelpers.getCollectionHelpers();
	it('Expect getCollectionHelpers to return a plain Object', function() {
		expect(_.isPlainObject(helpers)).to.be(true);
	});
	it('Expect getCollectionHelpers to return a plain Object with 15 attributes', function() {
		expect(_.keys(helpers).length).to.equal(15);
	});
	_.each(helpers, function(helper, helperName) {
		it('Expect getCollectionHelpers.' + helperName + ' to be a Function', function() {
			expect(_.isFunction(helper)).to.be(true);
		});
	});
});
describe('Verify Test Data', function() {
	var testDataMap = {
		bankUserInfo: {
			data: bankUserInfoData,
			dataFields: ['customerId', 'name', 'bank', 'balance'],
			attrCount: 4
		},
		userInfo: {
			data: userInfoData,
			dataFields: ['uid', 'name', 'age', 'eyeColor', 'gender', 'isActive'],
			attrCount: 6
		},
		fullNameInfo: {
			data: fullNameInfoData,
			dataFields: ['uid', 'name'],
			attrCount: 2
		},
		workInfo: {
			data: workInfoData,
			dataFields: ['employeeId', 'name', 'company', 'email', 'phone', 'details', 'details.greeting', 'details.other'],
			attrCount: 6
		}
	};
	it('Test Data is Valid', function() {
		_.each(testDataMap, function(dataConfig) {
			expect(dataConfig.data.length).to.equal(20);
			_.each(dataConfig.data, function(item, index) {
				expect(_.keys(item).length).to.equal(dataConfig.attrCount);
				_.each(dataConfig.dataFields, function(field) {
					var validField = !_.isUndefined(_.get(item, field));
					expect(validField).to.be(true);
				});
			});
		});
	});
});