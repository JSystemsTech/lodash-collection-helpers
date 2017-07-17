'use strict';
var _ = require('lodash'),
	expect = require('must'),
	lodashCollectionHelpers = require('./lodash-collection-helpers'),
	bankUserInfoData = require('../test/bankUserInfo'),
	userInfoData = require('../test/userInfo'),
	fullNameInfoData = require('../test/fullNameInfo'),
	workInfoData = require('../test/workInfo');

describe('Testing Lodash Collection Helpers', function() {
	describe('Verify Test Data', function() {
		// var bankUserInfo,
		// userInfo,
		// fullNameInfo,
		// workInfo;
		// beforeEach(function() {
		// 	bankUserInfo = bankUserInfoData;
		// 	userInfo = userInfoData;
		// 	fullNameInfo = fullNameInfoData;
		// 	workInfo = workInfoData;

		// });
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
	describe('Testing getCollectionHelpers', function() {
		var helpers = lodashCollectionHelpers.getCollectionHelpers();
		it('Expect getCollectionHelpers to return a plain Object', function() {
			expect(_.isPlainObject(helpers)).to.be(true);
		});
		it('Expect getCollectionHelpers to return a plain Object with 10 attributes', function() {
			expect(_.keys(helpers).length).to.equal(10);
		});
		_.each(helpers, function(helper, helperName) {
			it('Expect getCollectionHelpers.' + helperName + ' to be a Function', function() {
				expect(_.isFunction(helper)).to.be(true);
			});
		});
	});
	describe('Testing isCollection', function() {
		it('with undefined value', function() {
			expect(lodashCollectionHelpers.isCollection()).to.be(false);
		});
		it('with null value', function() {
			expect(lodashCollectionHelpers.isCollection(null)).to.be(false);
		});
		it('with string value', function() {
			expect(lodashCollectionHelpers.isCollection('should return false')).to.be(false);
		});
		it('with number value', function() {
			expect(lodashCollectionHelpers.isCollection(111)).to.be(false);
		});
		it('with plain object value', function() {
			expect(lodashCollectionHelpers.isCollection({
				shouldReturnFalse: true
			})).to.be(false);
		});
		it('with with empty array value', function() {
			expect(lodashCollectionHelpers.isCollection([])).to.be(true);
		});
		it('with array of strings value', function() {
			expect(lodashCollectionHelpers.isCollection(['should return false'])).to.be(false);
		});
		it('with array of numbers value', function() {
			expect(lodashCollectionHelpers.isCollection([111])).to.be(false);
		});
		it('with array of plain objects value', function() {
			expect(lodashCollectionHelpers.isCollection([{
				shouldReturnTrue: true
			}])).to.be(true);
		});
	});
	describe('Testing pickAs', function() {
		var workInfo;
		beforeEach(function() {
			workInfo = workInfoData;
		});

		it('With plain object and undefined source map returns empty object', function() {
			var data = workInfo[0];
			var selectedData = lodashCollectionHelpers.pickAs(data);
			expect(_.isPlainObject(selectedData)).to.be(true);
			expect(_.isEmpty(selectedData)).to.be(true);
		});
		it('With plain object and array source map to return what _.pick would return', function() {
			var data = workInfo[0];
			var sourceMap = ['name', 'company'];
			var selectedData = lodashCollectionHelpers.pickAs(data, sourceMap);
			expect(_.keys(selectedData).length).to.equal(2);
			expect(selectedData.name).to.equal(data.name);
			expect(selectedData.company).to.equal(data.company);
		});
		it('With String source and object source map to return String source', function() {
			var data = "Invalid";
			var sourceMap = {
				'name': 'employeeName',
				'company': 'employer'
			};
			var selectedData = lodashCollectionHelpers.pickAs(data, sourceMap);
			expect(_.isString(data)).to.be(true);
			expect(selectedData).to.equal(data);
		});
		it('With plain object and object source map to return modified object', function() {
			var data = workInfo[0];
			var sourceMap = {
				'name': 'employeeName',
				'company': 'employer'
			};
			var selectedData = lodashCollectionHelpers.pickAs(data, sourceMap);
			expect(_.keys(selectedData).length).to.equal(2);
			expect(selectedData.employeeName).to.equal(data.name);
			expect(selectedData.employer).to.equal(data.company);
		});
		it('With plain object and object source map to return modified object nested values', function() {
			var data = workInfo[0];
			var sourceMap = {
				'name': 'employeeName',
				'company': 'employer',
				'details.greeting': 'personalGreeting',
				'details.other': 'otherInfo.other'
			};
			var selectedData = lodashCollectionHelpers.pickAs(data, sourceMap);
			expect(_.keys(selectedData).length).to.equal(4);
			expect(selectedData.employeeName).to.equal(data.name);
			expect(selectedData.employer).to.equal(data.company);
			expect(selectedData.personalGreeting).to.equal(data.details.greeting);
			expect(selectedData.otherInfo.other).to.equal(data.details.other);
		});
		it('With collection and object source map to return modified object', function() {
			var sourceMap = {
				'employeeId': 'employeeId',
				'name': 'employeeName',
				'company': 'employer'
			};
			var selectedData = lodashCollectionHelpers.pickAs(workInfo, sourceMap);
			expect(selectedData.length).to.equal(20);
			_.each(selectedData, function(item) {
				var original = _.find(workInfo, {
					employeeId: item.employeeId
				});
				expect(_.keys(item).length).to.equal(3);
				expect(item.employeeId).to.equal(original.employeeId);
				expect(item.employeeName).to.equal(original.name);
				expect(item.employer).to.equal(original.company);
			});
		});
	});
	describe('Testing pickAllAs', function() {
		var bankUserInfo,
			userInfo,
			fullNameInfo,
			workInfo;
		beforeEach(function() {
			bankUserInfo = bankUserInfoData;
			userInfo = userInfoData;
			fullNameInfo = fullNameInfoData;
			workInfo = workInfoData;

		});

		it('With plain object and undefined source map returns original object', function() {
			var data = workInfo[0];
			var selectedData = lodashCollectionHelpers.pickAllAs(data);
			expect(_.keys(selectedData).length).to.equal(6);
			expect(selectedData.employeeId).to.equal(data.employeeId);
			expect(selectedData.name).to.equal(data.name);
			expect(selectedData.company).to.equal(data.company);
			expect(selectedData.email).to.equal(data.email);
			expect(selectedData.phone).to.equal(data.phone);
			expect(selectedData.details.greeting).to.equal(data.details.greeting);
			expect(selectedData.details.other).to.equal(data.details.other);
		});
		it('With plain object and array source map returns original object', function() {
			var data = workInfo[0];
			var sourceMap = ['name', 'company'];
			var selectedData = lodashCollectionHelpers.pickAllAs(data, sourceMap);
			expect(_.keys(selectedData).length).to.equal(6);
			expect(selectedData.employeeId).to.equal(data.employeeId);
			expect(selectedData.name).to.equal(data.name);
			expect(selectedData.company).to.equal(data.company);
			expect(selectedData.email).to.equal(data.email);
			expect(selectedData.phone).to.equal(data.phone);
			expect(selectedData.details.greeting).to.equal(data.details.greeting);
			expect(selectedData.details.other).to.equal(data.details.other);
		});
		it('With plain object and object source map to return modified object', function() {
			var data = workInfo[0];
			var sourceMap = {
				'name': 'employeeName',
				'company': 'employer'
			};
			var selectedData = lodashCollectionHelpers.pickAllAs(data, sourceMap);
			expect(_.keys(selectedData).length).to.equal(6);
			expect(selectedData.employeeId).to.equal(data.employeeId);
			expect(selectedData.employeeName).to.equal(data.name);
			expect(selectedData.employer).to.equal(data.company);
			expect(selectedData.email).to.equal(data.email);
			expect(selectedData.phone).to.equal(data.phone);
			expect(selectedData.details.greeting).to.equal(data.details.greeting);
			expect(selectedData.details.other).to.equal(data.details.other);
		});
		it('With plain object and object source map to return modified object nested values', function() {
			var data = workInfo[0];
			var sourceMap = {
				'name': 'employeeName',
				'company': 'employer',
				'details.greeting': 'personalGreeting',
				'details.other': 'otherInfo.other'
			};
			var selectedData = lodashCollectionHelpers.pickAllAs(data, sourceMap);
			expect(_.keys(selectedData).length).to.equal(8);
			expect(selectedData.employeeId).to.equal(data.employeeId);
			expect(selectedData.employeeName).to.equal(data.name);
			expect(selectedData.employer).to.equal(data.company);
			expect(selectedData.email).to.equal(data.email);
			expect(selectedData.phone).to.equal(data.phone);
			expect(selectedData.personalGreeting).to.equal(data.details.greeting);
			expect(selectedData.otherInfo.other).to.equal(data.details.other);
		});
		it('With collection and object source map to return modified object', function() {
			var sourceMap = {
				'employeeId': 'employeeId',
				'name': 'employeeName',
				'company': 'employer'
			};
			var selectedData = lodashCollectionHelpers.pickAllAs(workInfo, sourceMap);
			expect(selectedData.length).to.equal(20);
			_.each(selectedData, function(item) {
				var original = _.find(workInfo, {
					employeeId: item.employeeId
				});
				expect(_.keys(item).length).to.equal(6);
				expect(item.employeeId).to.equal(original.employeeId);
				expect(item.employeeName).to.equal(original.name);
				expect(item.employer).to.equal(original.company);
				expect(item.email).to.equal(original.email);
				expect(item.phone).to.equal(original.phone);
				expect(item.details.greeting).to.equal(original.details.greeting);
				expect(item.details.other).to.equal(original.details.other);
			});
		});
	});
	describe('Testing select', function() {
		var workInfo;
		beforeEach(function() {
			workInfo = workInfoData;
		});

		it('With plain object and undefined source map returns empty object', function() {
			var data = workInfo[0];
			var selectedData = lodashCollectionHelpers.select(data);
			expect(_.isPlainObject(selectedData)).to.be(true);
			expect(_.isEmpty(selectedData)).to.be(true);
		});
		it('With plain object and array source map to return what _.pick would return', function() {
			var data = workInfo[0];
			var sourceMap = ['name', 'company'];
			var selectedData = lodashCollectionHelpers.select(data, sourceMap);
			expect(_.keys(selectedData).length).to.equal(2);
			expect(selectedData.name).to.equal(data.name);
			expect(selectedData.company).to.equal(data.company);
		});
		it('With plain object and object source map to return modified object', function() {
			var data = workInfo[0];
			var sourceMap = {
				'name': 'employeeName',
				'company': 'employer'
			};
			var selectedData = lodashCollectionHelpers.select(data, sourceMap);
			expect(_.keys(selectedData).length).to.equal(2);
			expect(selectedData.employeeName).to.equal(data.name);
			expect(selectedData.employer).to.equal(data.company);
		});
		it('With plain object and object source map to return modified object nested values', function() {
			var data = workInfo[0];
			var sourceMap = {
				'name': 'employeeName',
				'company': 'employer',
				'details.greeting': 'personalGreeting',
				'details.other': 'otherInfo.other'
			};
			var selectedData = lodashCollectionHelpers.select(data, sourceMap);
			expect(_.keys(selectedData).length).to.equal(4);
			expect(selectedData.employeeName).to.equal(data.name);
			expect(selectedData.employer).to.equal(data.company);
			expect(selectedData.personalGreeting).to.equal(data.details.greeting);
			expect(selectedData.otherInfo.other).to.equal(data.details.other);
		});
		it('With collection and object source map to return modified object', function() {
			var sourceMap = {
				'employeeId': 'employeeId',
				'name': 'employeeName',
				'company': 'employer'
			};
			var selectedData = lodashCollectionHelpers.select(workInfo, sourceMap);
			expect(selectedData.length).to.equal(20);
			_.each(selectedData, function(item) {
				var original = _.find(workInfo, {
					employeeId: item.employeeId
				});
				expect(_.keys(item).length).to.equal(3);
				expect(item.employeeId).to.equal(original.employeeId);
				expect(item.employeeName).to.equal(original.name);
				expect(item.employer).to.equal(original.company);
			});
		});
	});
	describe('Testing selectAll', function() {
		var workInfo;
		beforeEach(function() {
			workInfo = workInfoData;
		});

		it('With plain object and undefined source map returns original object', function() {
			var data = workInfo[0];
			var selectedData = lodashCollectionHelpers.selectAll(data);
			expect(_.keys(selectedData).length).to.equal(6);
			expect(selectedData.employeeId).to.equal(data.employeeId);
			expect(selectedData.name).to.equal(data.name);
			expect(selectedData.company).to.equal(data.company);
			expect(selectedData.email).to.equal(data.email);
			expect(selectedData.phone).to.equal(data.phone);
			expect(selectedData.details.greeting).to.equal(data.details.greeting);
			expect(selectedData.details.other).to.equal(data.details.other);
		});
		it('With plain object and array source map returns original object', function() {
			var data = workInfo[0];
			var sourceMap = ['name', 'company'];
			var selectedData = lodashCollectionHelpers.selectAll(data, sourceMap);
			expect(_.keys(selectedData).length).to.equal(6);
			expect(selectedData.employeeId).to.equal(data.employeeId);
			expect(selectedData.name).to.equal(data.name);
			expect(selectedData.company).to.equal(data.company);
			expect(selectedData.email).to.equal(data.email);
			expect(selectedData.phone).to.equal(data.phone);
			expect(selectedData.details.greeting).to.equal(data.details.greeting);
			expect(selectedData.details.other).to.equal(data.details.other);
		});
		it('With plain object and object source map to return modified object', function() {
			var data = workInfo[0];
			var sourceMap = {
				'name': 'employeeName',
				'company': 'employer'
			};
			var selectedData = lodashCollectionHelpers.selectAll(data, sourceMap);
			expect(_.keys(selectedData).length).to.equal(6);
			expect(selectedData.employeeId).to.equal(data.employeeId);
			expect(selectedData.employeeName).to.equal(data.name);
			expect(selectedData.employer).to.equal(data.company);
			expect(selectedData.email).to.equal(data.email);
			expect(selectedData.phone).to.equal(data.phone);
			expect(selectedData.details.greeting).to.equal(data.details.greeting);
			expect(selectedData.details.other).to.equal(data.details.other);
		});
		it('With plain object and object source map to return modified object nested values', function() {
			var data = workInfo[0];
			var sourceMap = {
				'name': 'employeeName',
				'company': 'employer',
				'details.greeting': 'personalGreeting',
				'details.other': 'otherInfo.other'
			};
			var selectedData = lodashCollectionHelpers.selectAll(data, sourceMap);
			expect(_.keys(selectedData).length).to.equal(8);
			expect(selectedData.employeeId).to.equal(data.employeeId);
			expect(selectedData.employeeName).to.equal(data.name);
			expect(selectedData.employer).to.equal(data.company);
			expect(selectedData.email).to.equal(data.email);
			expect(selectedData.phone).to.equal(data.phone);
			expect(selectedData.personalGreeting).to.equal(data.details.greeting);
			expect(selectedData.otherInfo.other).to.equal(data.details.other);
		});
		it('With collection and object source map to return modified object', function() {
			var sourceMap = {
				'employeeId': 'employeeId',
				'name': 'employeeName',
				'company': 'employer'
			};
			var selectedData = lodashCollectionHelpers.selectAll(workInfo, sourceMap);
			expect(selectedData.length).to.equal(20);
			_.each(selectedData, function(item) {
				var original = _.find(workInfo, {
					employeeId: item.employeeId
				});
				expect(_.keys(item).length).to.equal(6);
				expect(item.employeeId).to.equal(original.employeeId);
				expect(item.employeeName).to.equal(original.name);
				expect(item.employer).to.equal(original.company);
				expect(item.email).to.equal(original.email);
				expect(item.phone).to.equal(original.phone);
				expect(item.details.greeting).to.equal(original.details.greeting);
				expect(item.details.other).to.equal(original.details.other);
			});
		});
	});
	describe('Testing joinOn', function() {
		var bankUserInfo,
			userInfo,
			fullNameInfo;
		beforeEach(function() {
			bankUserInfo = bankUserInfoData;
			userInfo = userInfoData;
			fullNameInfo = lodashCollectionHelpers.selectAll(fullNameInfoData, {
				name: 'fullName'
			});
		});
		it('With invalid collections returns empty array', function() {
			var joinedCollection = lodashCollectionHelpers.joinOn("userInfo", "fullNameInfo", 'uid');
			expect(_.isArray(joinedCollection)).to.be(true);
			expect(_.isEmpty(joinedCollection)).to.be(true);
		});
		it('With same named match key', function() {
			var joinedCollection = lodashCollectionHelpers.joinOn(userInfo, fullNameInfo, 'uid');
			expect(joinedCollection.length).to.equal(20);
			_.each(joinedCollection, function(item) {
				var originalUserInfo = _.find(userInfo, {
					uid: item.uid
				});
				var originalFullNameInfo = _.find(fullNameInfo, {
					uid: item.uid
				});
				expect(_.keys(item).length).to.equal(7);
				expect(item.uid).to.equal(originalUserInfo.uid);
				expect(item.name).to.equal(originalUserInfo.name);
				expect(item.age).to.equal(originalUserInfo.age);
				expect(item.eyeColor).to.equal(originalUserInfo.eyeColor);
				expect(item.gender).to.equal(originalUserInfo.gender);
				expect(item.isActive).to.equal(originalUserInfo.isActive);
				expect(item.fullName).to.equal(originalFullNameInfo.fullName);
			});
		});
		it('With same named match key & should not have any data to join', function() {
			var joinedCollection = lodashCollectionHelpers.joinOn(userInfo, bankUserInfo, 'uid');
			expect(joinedCollection.length).to.equal(20);
			_.each(joinedCollection, function(item) {
				var originalBankUserInfo = _.find(bankUserInfo, {
					customerId: item.uid
				});
				var originalUserInfo = _.find(userInfo, {
					uid: item.uid
				});
				expect(_.keys(item).length).to.equal(6);
				expect(item.uid).to.equal(originalUserInfo.uid);
				expect(item.name).to.equal(originalUserInfo.name);
				expect(item.age).to.equal(originalUserInfo.age);
				expect(item.eyeColor).to.equal(originalUserInfo.eyeColor);
				expect(item.gender).to.equal(originalUserInfo.gender);
				expect(item.isActive).to.equal(originalUserInfo.isActive);
			});
		});
		it('With differently named keys', function() {
			var joinedCollection = lodashCollectionHelpers.joinOn(userInfo, bankUserInfo, 'uid', 'customerId');
			expect(joinedCollection.length).to.equal(20);
			_.each(joinedCollection, function(item) {
				var originalBankUserInfo = _.find(bankUserInfo, {
					customerId: item.uid
				});
				var originalUserInfo = _.find(userInfo, {
					uid: item.uid
				});
				expect(_.keys(item).length).to.equal(9);
				expect(item.uid).to.equal(originalUserInfo.uid);
				expect(item.name).to.equal(originalUserInfo.name);
				expect(item.age).to.equal(originalUserInfo.age);
				expect(item.eyeColor).to.equal(originalUserInfo.eyeColor);
				expect(item.gender).to.equal(originalUserInfo.gender);
				expect(item.isActive).to.equal(originalUserInfo.isActive);
				expect(item.customerId).to.equal(originalBankUserInfo.customerId);
				expect(item.bank).to.equal(originalBankUserInfo.bank);
				expect(item.balance).to.equal(originalBankUserInfo.balance);
			});
		});
		it('With differently lengthed Collections', function() {
			bankUserInfo = _.take(bankUserInfo, 10);
			var joinedCollection = lodashCollectionHelpers.joinOn(userInfo, bankUserInfo, 'uid', 'customerId');
			expect(joinedCollection.length).to.equal(20);
			_.each(joinedCollection, function(item) {
				var originalBankUserInfo = _.find(bankUserInfo, {
					customerId: item.uid
				});
				var originalUserInfo = _.find(userInfo, {
					uid: item.uid
				});
				if (_.isPlainObject(originalBankUserInfo)) {
					expect(_.keys(item).length).to.equal(9);
					expect(item.customerId).to.equal(originalBankUserInfo.customerId);
					expect(item.bank).to.equal(originalBankUserInfo.bank);
					expect(item.balance).to.equal(originalBankUserInfo.balance);
				} else {
					expect(_.keys(item).length).to.equal(6);
				}
				expect(item.uid).to.equal(originalUserInfo.uid);
				expect(item.name).to.equal(originalUserInfo.name);
				expect(item.age).to.equal(originalUserInfo.age);
				expect(item.eyeColor).to.equal(originalUserInfo.eyeColor);
				expect(item.gender).to.equal(originalUserInfo.gender);
				expect(item.isActive).to.equal(originalUserInfo.isActive);
			});
		});
	});
	describe('Testing leftJoin', function() {
		var bankUserInfo,
			userInfo,
			fullNameInfo;
		beforeEach(function() {
			bankUserInfo = bankUserInfoData;
			userInfo = userInfoData;
			fullNameInfo = lodashCollectionHelpers.selectAll(fullNameInfoData, {
				name: 'fullName'
			});
		});
		it('With same named match key', function() {
			var joinedCollection = lodashCollectionHelpers.leftJoin(userInfo, fullNameInfo, 'uid');
			expect(joinedCollection.length).to.equal(20);
			_.each(joinedCollection, function(item) {
				var originalUserInfo = _.find(userInfo, {
					uid: item.uid
				});
				var originalFullNameInfo = _.find(fullNameInfo, {
					uid: item.uid
				});
				expect(_.keys(item).length).to.equal(7);
				expect(item.uid).to.equal(originalUserInfo.uid);
				expect(item.name).to.equal(originalUserInfo.name);
				expect(item.age).to.equal(originalUserInfo.age);
				expect(item.eyeColor).to.equal(originalUserInfo.eyeColor);
				expect(item.gender).to.equal(originalUserInfo.gender);
				expect(item.isActive).to.equal(originalUserInfo.isActive);
				expect(item.fullName).to.equal(originalFullNameInfo.fullName);
			});
		});
		it('With same named match key & should not have any data to join', function() {
			var joinedCollection = lodashCollectionHelpers.leftJoin(userInfo, bankUserInfo, 'uid');
			expect(joinedCollection.length).to.equal(20);
			_.each(joinedCollection, function(item) {
				var originalBankUserInfo = _.find(bankUserInfo, {
					customerId: item.uid
				});
				var originalUserInfo = _.find(userInfo, {
					uid: item.uid
				});
				expect(_.keys(item).length).to.equal(6);
				expect(item.uid).to.equal(originalUserInfo.uid);
				expect(item.name).to.equal(originalUserInfo.name);
				expect(item.age).to.equal(originalUserInfo.age);
				expect(item.eyeColor).to.equal(originalUserInfo.eyeColor);
				expect(item.gender).to.equal(originalUserInfo.gender);
				expect(item.isActive).to.equal(originalUserInfo.isActive);
			});
		});
		it('With differently named keys', function() {
			var joinedCollection = lodashCollectionHelpers.leftJoin(userInfo, bankUserInfo, 'uid', 'customerId');
			expect(joinedCollection.length).to.equal(20);
			_.each(joinedCollection, function(item) {
				var originalBankUserInfo = _.find(bankUserInfo, {
					customerId: item.uid
				});
				var originalUserInfo = _.find(userInfo, {
					uid: item.uid
				});
				expect(_.keys(item).length).to.equal(9);
				expect(item.uid).to.equal(originalUserInfo.uid);
				expect(item.name).to.equal(originalUserInfo.name);
				expect(item.age).to.equal(originalUserInfo.age);
				expect(item.eyeColor).to.equal(originalUserInfo.eyeColor);
				expect(item.gender).to.equal(originalUserInfo.gender);
				expect(item.isActive).to.equal(originalUserInfo.isActive);
				expect(item.customerId).to.equal(originalBankUserInfo.customerId);
				expect(item.bank).to.equal(originalBankUserInfo.bank);
				expect(item.balance).to.equal(originalBankUserInfo.balance);
			});
		});
		it('With differently lengthed Collections', function() {
			bankUserInfo = _.take(bankUserInfo, 10);
			var joinedCollection = lodashCollectionHelpers.leftJoin(userInfo, bankUserInfo, 'uid', 'customerId');
			expect(joinedCollection.length).to.equal(20);
			_.each(joinedCollection, function(item) {
				var originalBankUserInfo = _.find(bankUserInfo, {
					customerId: item.uid
				});
				var originalUserInfo = _.find(userInfo, {
					uid: item.uid
				});
				if (_.isPlainObject(originalBankUserInfo)) {
					expect(_.keys(item).length).to.equal(9);
					expect(item.customerId).to.equal(originalBankUserInfo.customerId);
					expect(item.bank).to.equal(originalBankUserInfo.bank);
					expect(item.balance).to.equal(originalBankUserInfo.balance);
				} else {
					expect(_.keys(item).length).to.equal(6);
				}
				expect(item.uid).to.equal(originalUserInfo.uid);
				expect(item.name).to.equal(originalUserInfo.name);
				expect(item.age).to.equal(originalUserInfo.age);
				expect(item.eyeColor).to.equal(originalUserInfo.eyeColor);
				expect(item.gender).to.equal(originalUserInfo.gender);
				expect(item.isActive).to.equal(originalUserInfo.isActive);
			});
		});
	});
	describe('Testing rightJoin', function() {
		var bankUserInfo,
			userInfo,
			fullNameInfo;
		beforeEach(function() {
			bankUserInfo = bankUserInfoData;
			userInfo = userInfoData;
			fullNameInfo = lodashCollectionHelpers.selectAll(fullNameInfoData, {
				name: 'fullName'
			});
		});
		it('With same named match key', function() {
			var joinedCollection = lodashCollectionHelpers.rightJoin(userInfo, fullNameInfo, 'uid');
			expect(joinedCollection.length).to.equal(20);
			_.each(joinedCollection, function(item) {
				var originalUserInfo = _.find(userInfo, {
					uid: item.uid
				});
				var originalFullNameInfo = _.find(fullNameInfo, {
					uid: item.uid
				});
				expect(_.keys(item).length).to.equal(7);
				expect(item.uid).to.equal(originalUserInfo.uid);
				expect(item.name).to.equal(originalUserInfo.name);
				expect(item.age).to.equal(originalUserInfo.age);
				expect(item.eyeColor).to.equal(originalUserInfo.eyeColor);
				expect(item.gender).to.equal(originalUserInfo.gender);
				expect(item.isActive).to.equal(originalUserInfo.isActive);
				expect(item.fullName).to.equal(originalFullNameInfo.fullName);
			});
		});
		it('With same named match key & should not have any data to join', function() {
			var joinedCollection = lodashCollectionHelpers.rightJoin(userInfo, bankUserInfo, 'uid');
			expect(joinedCollection.length).to.equal(20);
			_.each(joinedCollection, function(item) {
				var originalBankUserInfo = _.find(bankUserInfo, {
					customerId: item.customerId
				});
				expect(_.keys(item).length).to.equal(4);
				expect(item.customerId).to.equal(originalBankUserInfo.customerId);
				expect(item.name).to.equal(originalBankUserInfo.name);
				expect(item.bank).to.equal(originalBankUserInfo.bank);
				expect(item.balance).to.equal(originalBankUserInfo.balance);
			});
		});
		it('With differently named keys', function() {
			var joinedCollection = lodashCollectionHelpers.rightJoin(userInfo, bankUserInfo, 'uid', 'customerId');
			expect(joinedCollection.length).to.equal(20);
			_.each(joinedCollection, function(item) {
				var originalBankUserInfo = _.find(bankUserInfo, {
					customerId: item.uid
				});
				var originalUserInfo = _.find(userInfo, {
					uid: item.uid
				});
				expect(_.keys(item).length).to.equal(9);
				expect(item.uid).to.equal(originalUserInfo.uid);
				expect(item.name).to.equal(originalUserInfo.name);
				expect(item.age).to.equal(originalUserInfo.age);
				expect(item.eyeColor).to.equal(originalUserInfo.eyeColor);
				expect(item.gender).to.equal(originalUserInfo.gender);
				expect(item.isActive).to.equal(originalUserInfo.isActive);
				expect(item.customerId).to.equal(originalBankUserInfo.customerId);
				expect(item.bank).to.equal(originalBankUserInfo.bank);
				expect(item.balance).to.equal(originalBankUserInfo.balance);
			});
		});
		it('With differently lengthed Collections', function() {
			bankUserInfo = _.take(bankUserInfo, 10);
			var joinedCollection = lodashCollectionHelpers.rightJoin(userInfo, bankUserInfo, 'uid', 'customerId');
			expect(joinedCollection.length).to.equal(10);
			_.each(joinedCollection, function(item) {
				var originalBankUserInfo = _.find(bankUserInfo, {
					customerId: item.customerId
				});
				var originalUserInfo = _.find(userInfo, {
					uid: item.customerId
				});
				if (_.isPlainObject(originalUserInfo)) {
					expect(_.keys(item).length).to.equal(9);
					expect(item.uid).to.equal(originalUserInfo.uid);
					expect(item.name).to.equal(originalUserInfo.name);
					expect(item.age).to.equal(originalUserInfo.age);
					expect(item.eyeColor).to.equal(originalUserInfo.eyeColor);
					expect(item.gender).to.equal(originalUserInfo.gender);
					expect(item.isActive).to.equal(originalUserInfo.isActive);
				} else {
					expect(_.keys(item).length).to.equal(4);
				}
				expect(item.customerId).to.equal(originalBankUserInfo.customerId);
				expect(item.bank).to.equal(originalBankUserInfo.bank);
				expect(item.balance).to.equal(originalBankUserInfo.balance);

			});
		});
	});
	describe('Testing innerJoin', function() {
		var bankUserInfo,
			userInfo,
			fullNameInfo;
		beforeEach(function() {
			bankUserInfo = bankUserInfoData;
			userInfo = userInfoData;
			fullNameInfo = lodashCollectionHelpers.selectAll(fullNameInfoData, {
				name: 'fullName'
			});
		});
		it('With same named match key', function() {
			var joinedCollection = lodashCollectionHelpers.innerJoin(userInfo, fullNameInfo, 'uid');
			expect(joinedCollection.length).to.equal(20);
			_.each(joinedCollection, function(item) {
				var originalUserInfo = _.find(userInfo, {
					uid: item.uid
				});
				var originalFullNameInfo = _.find(fullNameInfo, {
					uid: item.uid
				});
				expect(_.keys(item).length).to.equal(7);
				expect(item.uid).to.equal(originalUserInfo.uid);
				expect(item.name).to.equal(originalUserInfo.name);
				expect(item.age).to.equal(originalUserInfo.age);
				expect(item.eyeColor).to.equal(originalUserInfo.eyeColor);
				expect(item.gender).to.equal(originalUserInfo.gender);
				expect(item.isActive).to.equal(originalUserInfo.isActive);
				expect(item.fullName).to.equal(originalFullNameInfo.fullName);
			});
		});
		it('With same named match key & should not have any data to join', function() {
			var joinedCollection = lodashCollectionHelpers.innerJoin(userInfo, bankUserInfo, 'uid');
			expect(joinedCollection.length).to.equal(0);
		});
		it('With differently named keys', function() {
			var joinedCollection = lodashCollectionHelpers.innerJoin(userInfo, bankUserInfo, 'uid', 'customerId');
			expect(joinedCollection.length).to.equal(20);
			_.each(joinedCollection, function(item) {
				var originalBankUserInfo = _.find(bankUserInfo, {
					customerId: item.uid
				});
				var originalUserInfo = _.find(userInfo, {
					uid: item.uid
				});
				expect(_.keys(item).length).to.equal(9);
				expect(item.uid).to.equal(originalUserInfo.uid);
				expect(item.name).to.equal(originalUserInfo.name);
				expect(item.age).to.equal(originalUserInfo.age);
				expect(item.eyeColor).to.equal(originalUserInfo.eyeColor);
				expect(item.gender).to.equal(originalUserInfo.gender);
				expect(item.isActive).to.equal(originalUserInfo.isActive);
				expect(item.customerId).to.equal(originalBankUserInfo.customerId);
				expect(item.bank).to.equal(originalBankUserInfo.bank);
				expect(item.balance).to.equal(originalBankUserInfo.balance);
			});
		});
		it('With differently lengthed Collections', function() {
			bankUserInfo = _.take(bankUserInfo, 10);
			userInfo = _.takeRight(userInfo, 15);
			var joinedCollection = lodashCollectionHelpers.innerJoin(userInfo, bankUserInfo, 'uid', 'customerId');
			expect(joinedCollection.length).to.equal(5);
			_.each(joinedCollection, function(item) {
				var originalBankUserInfo = _.find(bankUserInfo, {
					customerId: item.uid
				});
				var originalUserInfo = _.find(userInfo, {
					uid: item.uid
				});
				expect(_.keys(item).length).to.equal(9);
				expect(item.uid).to.equal(originalUserInfo.uid);
				expect(item.name).to.equal(originalUserInfo.name);
				expect(item.age).to.equal(originalUserInfo.age);
				expect(item.eyeColor).to.equal(originalUserInfo.eyeColor);
				expect(item.gender).to.equal(originalUserInfo.gender);
				expect(item.isActive).to.equal(originalUserInfo.isActive);
				expect(item.customerId).to.equal(originalBankUserInfo.customerId);
				expect(item.bank).to.equal(originalBankUserInfo.bank);
				expect(item.balance).to.equal(originalBankUserInfo.balance);
			});
		});
	});
	describe('Testing fullJoin', function() {
		var bankUserInfo,
			userInfo,
			fullNameInfo;
		beforeEach(function() {
			bankUserInfo = bankUserInfoData;
			userInfo = userInfoData;
			fullNameInfo = lodashCollectionHelpers.selectAll(fullNameInfoData, {
				name: 'fullName'
			});
		});

		it('With invalid collections returns empty array', function() {
			var joinedCollection = lodashCollectionHelpers.fullJoin('userInfo', 'fullNameInfo', 'uid');
			expect(_.isArray(joinedCollection)).to.be(true);
			expect(_.isEmpty(joinedCollection)).to.be(true);
		});
		it('With invalid dest collection returns empty array', function() {
			var joinedCollection = lodashCollectionHelpers.fullJoin('userInfo', fullNameInfo, 'uid');
			expect(_.isArray(joinedCollection)).to.be(true);
			expect(_.isEmpty(joinedCollection)).to.be(true);
		});
		it('With invalid source collection returns empty array', function() {
			var joinedCollection = lodashCollectionHelpers.fullJoin(userInfo, 'fullNameInfo', 'uid');
			expect(_.isArray(joinedCollection)).to.be(true);
			expect(_.isEmpty(joinedCollection)).to.be(true);
		});
		it('With same named match key', function() {
			var joinedCollection = lodashCollectionHelpers.fullJoin(userInfo, fullNameInfo, 'uid');
			expect(joinedCollection.length).to.equal(20);
			_.each(joinedCollection, function(item) {
				var originalUserInfo = _.find(userInfo, {
					uid: item.uid
				});
				var originalFullNameInfo = _.find(fullNameInfo, {
					uid: item.uid
				});
				expect(_.keys(item).length).to.equal(7);
				expect(item.uid).to.equal(originalUserInfo.uid);
				expect(item.name).to.equal(originalUserInfo.name);
				expect(item.age).to.equal(originalUserInfo.age);
				expect(item.eyeColor).to.equal(originalUserInfo.eyeColor);
				expect(item.gender).to.equal(originalUserInfo.gender);
				expect(item.isActive).to.equal(originalUserInfo.isActive);
				expect(item.fullName).to.equal(originalFullNameInfo.fullName);

			});
		});
		it('With same named match key & should not have any data to join', function() {
			var joinedCollection = lodashCollectionHelpers.fullJoin(userInfo, bankUserInfo, 'uid');
			expect(joinedCollection.length).to.equal(40);
			_.each(joinedCollection, function(item) {
				if (_.keys(item).length === 4) {
					var originalBankUserInfo = _.find(bankUserInfo, {
						customerId: item.customerId
					});
					expect(item.customerId).to.equal(originalBankUserInfo.customerId);
					expect(item.bank).to.equal(originalBankUserInfo.bank);
					expect(item.balance).to.equal(originalBankUserInfo.balance);
				} else if (_.keys(item).length === 6) {
					var originalUserInfo = _.find(userInfo, {
						uid: item.uid
					});
					expect(item.uid).to.equal(originalUserInfo.uid);
					expect(item.name).to.equal(originalUserInfo.name);
					expect(item.age).to.equal(originalUserInfo.age);
					expect(item.eyeColor).to.equal(originalUserInfo.eyeColor);
					expect(item.gender).to.equal(originalUserInfo.gender);
					expect(item.isActive).to.equal(originalUserInfo.isActive);

				}
			});
		});
		it('With differently named keys', function() {
			var joinedCollection = lodashCollectionHelpers.fullJoin(userInfo, bankUserInfo, 'uid', 'customerId');
			expect(joinedCollection.length).to.equal(20);
			_.each(joinedCollection, function(item) {
				var originalBankUserInfo = _.find(bankUserInfo, {
					customerId: item.customerId
				});
				var originalUserInfo = _.find(userInfo, {
					uid: item.uid
				});
				if (_.isPlainObject(originalBankUserInfo) && _.isPlainObject(originalUserInfo)) {
					expect(_.keys(item).length).to.equal(9);
					expect(item.uid).to.equal(originalUserInfo.uid);
					expect(item.name).to.equal(originalUserInfo.name);
					expect(item.age).to.equal(originalUserInfo.age);
					expect(item.eyeColor).to.equal(originalUserInfo.eyeColor);
					expect(item.gender).to.equal(originalUserInfo.gender);
					expect(item.isActive).to.equal(originalUserInfo.isActive);
					expect(item.customerId).to.equal(originalBankUserInfo.customerId);
					expect(item.bank).to.equal(originalBankUserInfo.bank);
					expect(item.balance).to.equal(originalBankUserInfo.balance);
				} else {
					if (_.isPlainObject(originalBankUserInfo)) {
						expect(_.keys(item).length).to.equal(4);
						expect(item.customerId).to.equal(originalBankUserInfo.customerId);
						expect(item.bank).to.equal(originalBankUserInfo.bank);
						expect(item.balance).to.equal(originalBankUserInfo.balance);
					} else if (_.isPlainObject(originalUserInfo)) {
						expect(_.keys(item).length).to.equal(6);
						expect(item.uid).to.equal(originalUserInfo.uid);
						expect(item.name).to.equal(originalUserInfo.name);
						expect(item.age).to.equal(originalUserInfo.age);
						expect(item.eyeColor).to.equal(originalUserInfo.eyeColor);
						expect(item.gender).to.equal(originalUserInfo.gender);
						expect(item.isActive).to.equal(originalUserInfo.isActive);
					}
				}
			});
		});
		it('With differently lengthed Collections', function() {
			bankUserInfo = _.take(bankUserInfo, 10);
			userInfo = _.takeRight(userInfo, 15);
			var joinedCollection = lodashCollectionHelpers.fullJoin(userInfo, bankUserInfo, 'uid', 'customerId');
			expect(joinedCollection.length).to.equal(20);
			_.each(joinedCollection, function(item) {
				var originalBankUserInfo = _.find(bankUserInfo, {
					customerId: item.customerId
				});
				var originalUserInfo = _.find(userInfo, {
					uid: item.uid
				});
				if (_.isPlainObject(originalBankUserInfo) && _.isPlainObject(originalUserInfo)) {
					expect(_.keys(item).length).to.equal(9);
					expect(item.uid).to.equal(originalUserInfo.uid);
					expect(item.name).to.equal(originalUserInfo.name);
					expect(item.age).to.equal(originalUserInfo.age);
					expect(item.eyeColor).to.equal(originalUserInfo.eyeColor);
					expect(item.gender).to.equal(originalUserInfo.gender);
					expect(item.isActive).to.equal(originalUserInfo.isActive);
					expect(item.customerId).to.equal(originalBankUserInfo.customerId);
					expect(item.bank).to.equal(originalBankUserInfo.bank);
					expect(item.balance).to.equal(originalBankUserInfo.balance);
				} else {
					if (_.isPlainObject(originalBankUserInfo)) {
						expect(_.keys(item).length).to.equal(4);
						expect(item.customerId).to.equal(originalBankUserInfo.customerId);
						expect(item.bank).to.equal(originalBankUserInfo.bank);
						expect(item.balance).to.equal(originalBankUserInfo.balance);
					} else if (_.isPlainObject(originalUserInfo)) {
						expect(_.keys(item).length).to.equal(6);
						expect(item.uid).to.equal(originalUserInfo.uid);
						expect(item.name).to.equal(originalUserInfo.name);
						expect(item.age).to.equal(originalUserInfo.age);
						expect(item.eyeColor).to.equal(originalUserInfo.eyeColor);
						expect(item.gender).to.equal(originalUserInfo.gender);
						expect(item.isActive).to.equal(originalUserInfo.isActive);
					}
				}
			});
		});
	});
});