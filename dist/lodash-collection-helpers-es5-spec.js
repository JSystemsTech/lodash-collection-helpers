'use strict';
var _ = require('lodash'),
	expect = require('must'),
	lodashCollectionHelpers = require('./lodash-collection-helpers-es5'),
	bankUserInfoData = require('../test/bankUserInfo'),
	userInfoData = require('../test/userInfo'),
	fullNameInfoData = require('../test/fullNameInfo'),
	workInfoData = require('../test/workInfo');

describe('Testing ES5', function() {
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
	describe('Testing Lodash Collection Helpers in release 1.0.0', function() {
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
			it('When both collections have nested Id attributes', function() {
				var joinedCollection = lodashCollectionHelpers.leftJoin([{
					ids: {
						id: 1
					},
					value: 'Value One'
				}], [{
					uids: {
						uid: 1
					},
					value: 'Value One other'
				}], 'ids.id', 'uids.uid');
				expect(joinedCollection[0].ids.id).to.equal(1);
				expect(joinedCollection[0].uids.uid).to.equal(1);
				expect(joinedCollection[0].value).to.equal('Value One');
			});
			it('When both collections have matching attribute names default value is from left side collection', function() {
				var joinedCollection = lodashCollectionHelpers.leftJoin([{
					id: 1,
					value: 'Value One'
				}], [{
					uid: 1,
					value: 'Value One other'
				}], 'id', 'uid');
				expect(joinedCollection[0].id).to.equal(1);
				expect(joinedCollection[0].uid).to.equal(1);
				expect(joinedCollection[0].value).to.equal('Value One');
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
			it('When both collections have matching attribute names default value is from left side collection', function() {
				var joinedCollection = lodashCollectionHelpers.leftJoin([{
					id: 1,
					value: 'Value One'
				}], [{
					uid: 1,
					value: 'Value One other'
				}], 'id', 'uid');
				expect(joinedCollection[0].id).to.equal(1);
				expect(joinedCollection[0].uid).to.equal(1);
				expect(joinedCollection[0].value).to.equal('Value One');
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
			it('When both collections have matching attribute names default value is from right side collection', function() {
				var joinedCollection = lodashCollectionHelpers.rightJoin([{
					id: 1,
					value: 'Value One'
				}], [{
					uid: 1,
					value: 'Value One other'
				}], 'id', 'uid');
				expect(joinedCollection[0].id).to.equal(1);
				expect(joinedCollection[0].uid).to.equal(1);
				expect(joinedCollection[0].value).to.equal('Value One other');
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
			it('When both collections have matching attribute names default value is from left side collection', function() {
				var joinedCollection = lodashCollectionHelpers.leftJoin([{
					id: 1,
					value: 'Value One'
				}], [{
					uid: 1,
					value: 'Value One other'
				}], 'id', 'uid');
				expect(joinedCollection[0].id).to.equal(1);
				expect(joinedCollection[0].uid).to.equal(1);
				expect(joinedCollection[0].value).to.equal('Value One');
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
			it('When both collections have matching attribute names default value is from left side collection', function() {
				var joinedCollection = lodashCollectionHelpers.leftJoin([{
					id: 1,
					value: 'Value One'
				}], [{
					uid: 1,
					value: 'Value One other'
				}], 'id', 'uid');
				expect(joinedCollection[0].id).to.equal(1);
				expect(joinedCollection[0].uid).to.equal(1);
				expect(joinedCollection[0].value).to.equal('Value One');
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
		describe('Testing leftAntiJoin', function() {
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
				fullNameInfo = _.takeRight(fullNameInfo, 5);
				var joinedCollection = lodashCollectionHelpers.leftAntiJoin(userInfo, fullNameInfo, 'uid');
				expect(joinedCollection.length).to.equal(15);
				_.each(joinedCollection, function(item) {
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
			it('With same named match key & should not have any data to anti join', function() {
				var joinedCollection = lodashCollectionHelpers.leftAntiJoin(userInfo, fullNameInfo, 'uid');
				expect(joinedCollection.length).to.equal(0);
			});
			it('With same named match key & all data to anti join', function() {
				var joinedCollection = lodashCollectionHelpers.leftAntiJoin(userInfo, bankUserInfo, 'uid');
				expect(joinedCollection.length).to.equal(20);
				_.each(joinedCollection, function(item) {
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
				bankUserInfo = _.takeRight(bankUserInfo, 5);
				var joinedCollection = lodashCollectionHelpers.leftAntiJoin(userInfo, bankUserInfo, 'uid', 'customerId');
				expect(joinedCollection.length).to.equal(15);
				_.each(joinedCollection, function(item) {
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
		});
		describe('Testing rightAntiJoin', function() {
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
				userInfo = _.takeRight(userInfo, 5);
				var joinedCollection = lodashCollectionHelpers.rightAntiJoin(userInfo, fullNameInfo, 'uid');
				expect(joinedCollection.length).to.equal(15);
				_.each(joinedCollection, function(item) {
					var originalFullNameInfo = _.find(fullNameInfo, {
						uid: item.uid
					});
					expect(_.keys(item).length).to.equal(2);
					expect(item.uid).to.equal(originalFullNameInfo.uid);
					expect(item.fullName).to.equal(originalFullNameInfo.fullName);
				});
			});
			it('With same named match key & should not have any data to anti join', function() {
				var joinedCollection = lodashCollectionHelpers.rightAntiJoin(userInfo, fullNameInfo, 'uid');
				expect(joinedCollection.length).to.equal(0);
			});
			it('With same named match key & all data to anti join', function() {
				var joinedCollection = lodashCollectionHelpers.rightAntiJoin(userInfo, bankUserInfo, 'uid');
				expect(joinedCollection.length).to.equal(20);
				_.each(joinedCollection, function(item) {
					expect(_.keys(item).length).to.equal(4);
					var originalBankUserInfo = _.find(bankUserInfo, {
						customerId: item.customerId
					});
					expect(item.customerId).to.equal(originalBankUserInfo.customerId);
					expect(item.name).to.equal(originalBankUserInfo.name);
					expect(item.bank).to.equal(originalBankUserInfo.bank);
					expect(item.balance).to.equal(originalBankUserInfo.balance);
				});
			});
			it('With differently named keys', function() {
				userInfo = _.takeRight(userInfo, 5);
				var joinedCollection = lodashCollectionHelpers.rightAntiJoin(userInfo, bankUserInfo, 'uid', 'customerId');
				expect(joinedCollection.length).to.equal(15);
				_.each(joinedCollection, function(item) {
					expect(_.keys(item).length).to.equal(4);
					var originalBankUserInfo = _.find(bankUserInfo, {
						customerId: item.customerId
					});
					expect(item.customerId).to.equal(originalBankUserInfo.customerId);
					expect(item.name).to.equal(originalBankUserInfo.name);
					expect(item.bank).to.equal(originalBankUserInfo.bank);
					expect(item.balance).to.equal(originalBankUserInfo.balance);
				});
			});
		});
		describe('Testing fullAntiJoin', function() {
			var leftCollection,
				rightCollection1,
				rightCollection2,
				rightCollection3,
				userInfo,
				fullNameInfo;
			beforeEach(function() {
				leftCollection = [{
					uid: 1,
					value: 'only on left'
				}, {
					uid: 2,
					value: 'sharedLeft'
				}];
				rightCollection1 = [{
					uid: 3,
					value: 'only on right'
				}, {
					uid: 2,
					value: 'sharedRight'
				}];
				rightCollection2 = [{
					id: 3,
					value: 'only on right'
				}, {
					id: 2,
					value: 'sharedRight'
				}];
				rightCollection3 = [{
					uid: 3,
					value: 'only on right1'
				}, {
					uid: 4,
					value: 'sharedRight2'
				}];
				userInfo = userInfoData;
				fullNameInfo = lodashCollectionHelpers.selectAll(fullNameInfoData, {
					name: 'fullName'
				});
			});
			it('With same named match key', function() {
				var joinedCollection = lodashCollectionHelpers.fullAntiJoin(leftCollection, rightCollection1, 'uid');
				expect(joinedCollection.length).to.equal(2);
				_.each(joinedCollection, function(item) {
					expect(_.keys(item).length).to.equal(2);
					if (item.uid === 1) {
						expect(item.uid).to.equal(leftCollection[0].uid);
						expect(item.value).to.equal(leftCollection[0].value);
					} else {
						expect(item.uid).to.equal(rightCollection1[0].uid);
						expect(item.value).to.equal(rightCollection1[0].value);
					}
				});
			});
			it('With same named match key & should not have any data to anti join', function() {
				var joinedCollection = lodashCollectionHelpers.fullAntiJoin(userInfo, fullNameInfo, 'uid');
				expect(joinedCollection.length).to.equal(0);
			});
			it('With same named match key & all data to anti join', function() {
				var joinedCollection = lodashCollectionHelpers.fullAntiJoin(leftCollection, rightCollection3, 'uid');
				expect(joinedCollection.length).to.equal(4);
				_.each(joinedCollection, function(item, index) {
					expect(_.keys(item).length).to.equal(2);
					if (item.uid === 1 || item.uid === 2) {
						expect(item.uid).to.equal(leftCollection[index].uid);
						expect(item.value).to.equal(leftCollection[index].value);
					} else {
						expect(item.uid).to.equal(rightCollection3[index - 2].uid);
						expect(item.value).to.equal(rightCollection3[index - 2].value);
					}
				});
			});
			it('With differently named keys', function() {
				var joinedCollection = lodashCollectionHelpers.fullAntiJoin(leftCollection, rightCollection2, 'uid', 'id');
				expect(joinedCollection.length).to.equal(2);
				_.each(joinedCollection, function(item) {
					expect(_.keys(item).length).to.equal(2);
					if (item.uid === 1) {
						expect(item.uid).to.equal(leftCollection[0].uid);
						expect(item.value).to.equal(leftCollection[0].value);
					} else {
						expect(item.uid).to.equal(rightCollection2[0].uid);
						expect(item.value).to.equal(rightCollection2[0].value);
					}
				});
			});
		});
	});
	describe('Testing Lodash Collection Helpers in release 1.1.0', function() {
		describe('Testing indexBy', function() {
			var collection;
			beforeEach(function() {
				collection = _.map(_.range(4), function(value) {
					return {
						uid: value,
						test: 'test ' + value,
						static: 'static-value',
						data: {
							list: _.range(value * 2)
						}
					};
				});
			});
			it('Call with non-collection returns an empty plain Object', function() {
				var indexedCollection = lodashCollectionHelpers.indexBy('non collection', 'uid');
				expect(_.isPlainObject(indexedCollection)).to.be(true);
				expect(_.isEmpty(indexedCollection)).to.be(true);
			});
			it('Call with missing iteree returns indexed on collection index number', function() {
				var indexedCollection = lodashCollectionHelpers.indexBy(collection);
				expect(_.isPlainObject(indexedCollection)).to.be(true);
				expect(_.isEmpty(indexedCollection)).to.be(false);
				expect(_.every(indexedCollection, function(item, uidKey) {
					var originalItem = collection[_.parseInt(uidKey)];
					return _.isPlainObject(item) && _.isPlainObject(originalItem) && _.isEqual(item, originalItem);
				})).to.be(true);
			});
			it('Non-String Index value returns indexed on collection index number', function() {
				var indexedCollection = lodashCollectionHelpers.indexBy(collection, 'data.list');
				expect(_.isPlainObject(indexedCollection)).to.be(true);
				expect(_.isEmpty(indexedCollection)).to.be(false);
				expect(_.every(indexedCollection, function(item, uidKey) {
					var originalItem = collection[_.parseInt(uidKey)];
					return _.isPlainObject(item) && _.isPlainObject(originalItem) && _.isEqual(item, originalItem);
				})).to.be(true);
			});
			it('Index by uid string key', function() {
				var indexedCollection = lodashCollectionHelpers.indexBy(collection, 'uid');
				expect(_.isPlainObject(indexedCollection)).to.be(true);
				expect(_.isEmpty(indexedCollection)).to.be(false);
				expect(_.every(indexedCollection, function(item, uidKey) {
					var originalItem = _.find(collection, {
						uid: _.parseInt(uidKey)
					});
					return _.isPlainObject(item) && _.isPlainObject(originalItem) && _.isEqual(item, originalItem);
				})).to.be(true);
			});
			it('Index by function', function() {
				var indexedCollection = lodashCollectionHelpers.indexBy(collection, function(item) {
					return _.get(item, 'uid');
				});
				expect(_.isPlainObject(indexedCollection)).to.be(true);
				expect(_.isEmpty(indexedCollection)).to.be(false);
				expect(_.every(indexedCollection, function(item, uidKey) {
					var originalItem = _.find(collection, {
						uid: _.parseInt(uidKey)
					});
					return _.isPlainObject(item) && _.isPlainObject(originalItem) && _.isEqual(item, originalItem);
				})).to.be(true);
			});
			it('Index by static value', function() {
				var indexedCollection = lodashCollectionHelpers.indexBy(collection, 'static');
				expect(_.isPlainObject(indexedCollection)).to.be(true);
				expect(_.isEmpty(indexedCollection)).to.be(false);
				expect(_.every(indexedCollection, function(item, key) {
					var originalItem = _.find(collection, {
						uid: _.parseInt(item.uid)
					});
					var expectedKey = 'static-value';
					if (item.uid > 0) {
						expectedKey = expectedKey + '(' + item.uid + ')';
					}
					return _.isPlainObject(item) && _.isPlainObject(originalItem) && _.isEqual(item, originalItem) && expectedKey === key;
				})).to.be(true);
			});

		});
		describe('Testing uniqify', function() {
			var collection;
			beforeEach(function() {
				collection = _.map(_.range(4), function(value) {
					return {
						test: 'test ' + value,
						static: 'static-value',
						data: {
							list: _.range(value * 2)
						}
					};
				});
			});
			it('Call with non-collection returns original input value', function() {
				var uniqifiedCollection = lodashCollectionHelpers.uniqify('non collection');
				expect(_.isString(uniqifiedCollection)).to.be(true);
				expect(uniqifiedCollection).to.equal('non collection');
			});
			it('Base uniqification', function() {
				var idKey = 'uuid';
				var uniqifiedCollection = lodashCollectionHelpers.uniqify(collection);
				expect(lodashCollectionHelpers.isCollection(uniqifiedCollection)).to.be(true);
				expect(_.every(uniqifiedCollection, function(item, index) {
					var originalItem = collection[index];
					var unUniqifiedItem = _.omit(_.cloneDeep(item), [idKey]);
					var isUnique = _.filter(uniqifiedCollection, _.set({}, idKey, _.get(item, idKey))).length === 1;
					return _.isString(_.get(item, idKey)) && isUnique && _.isPlainObject(originalItem) && _.isEqual(unUniqifiedItem, originalItem);
				})).to.be(true);
			});
			it('Uniqify with "" id key', function() {
				var idKey = 'uuid';
				var uniqifiedCollection = lodashCollectionHelpers.uniqify(collection, "");
				expect(lodashCollectionHelpers.isCollection(uniqifiedCollection)).to.be(true);
				expect(_.every(uniqifiedCollection, function(item, index) {
					var originalItem = collection[index];
					var unUniqifiedItem = _.omit(_.cloneDeep(item), [idKey]);
					var isUnique = _.filter(uniqifiedCollection, _.set({}, idKey, _.get(item, idKey))).length === 1;
					return _.isString(_.get(item, idKey)) && isUnique && _.isPlainObject(originalItem) && _.isEqual(unUniqifiedItem, originalItem);
				})).to.be(true);
			});
			it('Uniqify with null id key', function() {
				var idKey = 'uuid';
				var uniqifiedCollection = lodashCollectionHelpers.uniqify(collection, null);
				expect(lodashCollectionHelpers.isCollection(uniqifiedCollection)).to.be(true);
				expect(_.every(uniqifiedCollection, function(item, index) {
					var originalItem = collection[index];
					var unUniqifiedItem = _.omit(_.cloneDeep(item), [idKey]);
					var isUnique = _.filter(uniqifiedCollection, _.set({}, idKey, _.get(item, idKey))).length === 1;
					return _.isString(_.get(item, idKey)) && isUnique && _.isPlainObject(originalItem) && _.isEqual(unUniqifiedItem, originalItem);
				})).to.be(true);
			});
			it('Uniqify with non-string id key', function() {
				var idKey = 'uuid';
				var uniqifiedCollection = lodashCollectionHelpers.uniqify(collection, {
					test: 'test'
				});
				expect(lodashCollectionHelpers.isCollection(uniqifiedCollection)).to.be(true);
				expect(_.every(uniqifiedCollection, function(item, index) {
					var originalItem = collection[index];
					var unUniqifiedItem = _.omit(_.cloneDeep(item), [idKey]);
					var isUnique = _.filter(uniqifiedCollection, _.set({}, idKey, _.get(item, idKey))).length === 1;
					return _.isString(_.get(item, idKey)) && isUnique && _.isPlainObject(originalItem) && _.isEqual(unUniqifiedItem, originalItem);
				})).to.be(true);
			});
			it('Uniqify with user defined id key', function() {
				var idKey = 'uid';
				var uniqifiedCollection = lodashCollectionHelpers.uniqify(collection, idKey);
				expect(lodashCollectionHelpers.isCollection(uniqifiedCollection)).to.be(true);
				expect(_.every(uniqifiedCollection, function(item, index) {
					var originalItem = collection[index];
					var unUniqifiedItem = _.omit(_.cloneDeep(item), [idKey]);
					var isUnique = _.filter(uniqifiedCollection, _.set({}, idKey, _.get(item, idKey))).length === 1;
					return _.isString(_.get(item, idKey)) && isUnique && _.isPlainObject(originalItem) && _.isEqual(unUniqifiedItem, originalItem);
				})).to.be(true);
			});
			it('Uniqify with user defined function', function() {
				var idKey = 'uid';
				var uniqifiedCollection = lodashCollectionHelpers.uniqify(collection, idKey, function(item) {
					return _.get(item, 'test');
				});
				expect(lodashCollectionHelpers.isCollection(uniqifiedCollection)).to.be(true);
				expect(_.every(uniqifiedCollection, function(item, index) {
					var originalItem = collection[index];
					var unUniqifiedItem = _.omit(_.cloneDeep(item), [idKey]);
					var isUnique = _.filter(uniqifiedCollection, _.set({}, idKey, _.get(item, idKey))).length === 1;
					return _.isString(_.get(item, idKey)) && isUnique && _.isPlainObject(originalItem) && _.isEqual(unUniqifiedItem, originalItem);
				})).to.be(true);
			});
			it('Uniqify with user defined function that returns static value', function() {
				var idKey = 'uid';
				var uniqifiedCollection = lodashCollectionHelpers.uniqify(collection, idKey, function(item) {
					return _.get(item, 'static');
				});
				expect(lodashCollectionHelpers.isCollection(uniqifiedCollection)).to.be(true);
				expect(_.every(uniqifiedCollection, function(item, index) {
					var originalItem = collection[index];
					var unUniqifiedItem = _.omit(_.cloneDeep(item), [idKey]);
					var isUnique = _.filter(uniqifiedCollection, _.set({}, idKey, _.get(item, idKey))).length === 1;
					return _.isString(_.get(item, idKey)) && isUnique && _.isPlainObject(originalItem) && _.isEqual(unUniqifiedItem, originalItem);
				})).to.be(true);
			});
			it('Uniqify with user defined function that returns non-string value', function() {
				var idKey = 'uid';
				var uniqifiedCollection = lodashCollectionHelpers.uniqify(collection, idKey, function(item) {
					return _.get(item, 'data.list');
				});
				expect(lodashCollectionHelpers.isCollection(uniqifiedCollection)).to.be(true);
				expect(_.every(uniqifiedCollection, function(item, index) {
					var originalItem = collection[index];
					var unUniqifiedItem = _.omit(_.cloneDeep(item), [idKey]);
					var isUnique = _.filter(uniqifiedCollection, _.set({}, idKey, _.get(item, idKey))).length === 1;
					return _.isString(_.get(item, idKey)) && isUnique && _.isPlainObject(originalItem) && _.isEqual(unUniqifiedItem, originalItem);
				})).to.be(true);
			});
		});
	});
});