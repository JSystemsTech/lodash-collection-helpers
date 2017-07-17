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
			expect(_.isCollection()).to.be(false);
		});
		it('with null value', function() {
			expect(_.isCollection(null)).to.be(false);
		});
		it('with string value', function() {
			expect(_.isCollection('should return false')).to.be(false);
		});
		it('with number value', function() {
			expect(_.isCollection(111)).to.be(false);
		});
		it('with plain object value', function() {
			expect(_.isCollection({
				shouldReturnFalse: true
			})).to.be(false);
		});
		it('with with empty array value', function() {
			expect(_.isCollection([])).to.be(true);
		});
		it('with array of strings value', function() {
			expect(_.isCollection(['should return false'])).to.be(false);
		});
		it('with array of numbers value', function() {
			expect(_.isCollection([111])).to.be(false);
		});
		it('with array of plain objects value', function() {
			expect(_.isCollection([{
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
			var selectedData = _.pickAs(data);
			expect(_.isPlainObject(selectedData)).to.be(true);
			expect(_.isEmpty(selectedData)).to.be(true);
		});
		it('With plain object and array source map to return what _.pick would return', function() {
			var data = workInfo[0];
			var sourceMap = ['name', 'company'];
			var selectedData = _.pickAs(data, sourceMap);
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
			var selectedData = _.pickAs(data, sourceMap);
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
			var selectedData = _.pickAs(data, sourceMap);
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
			var selectedData = _.pickAs(workInfo, sourceMap);
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
			var selectedData = _.pickAllAs(data);
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
			var selectedData = _.pickAllAs(data, sourceMap);
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
			var selectedData = _.pickAllAs(data, sourceMap);
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
			// {
			// 	"employeeId": "670c8101-5650-450b-83b9-02ef5363ad90",
			// 	"name": "Garza Villarreal",
			// 	"company": "SYNTAC",
			// 	"email": "garzavillarreal@syntac.com",
			// 	"phone": "(928) 508-2074",
			// 	"details": {
			// 		"greeting": "Hello, Garza Villarreal!",
			// 		"other": "Other details for Garza Villarreal"
			// 	}
			// }
			var selectedData = _.pickAllAs(data, sourceMap);
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
			var selectedData = _.pickAllAs(workInfo, sourceMap);
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
			var selectedData = _.select(data);
			expect(_.isPlainObject(selectedData)).to.be(true);
			expect(_.isEmpty(selectedData)).to.be(true);
		});
		it('With plain object and array source map to return what _.pick would return', function() {
			var data = workInfo[0];
			var sourceMap = ['name', 'company'];
			var selectedData = _.select(data, sourceMap);
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
			var selectedData = _.select(data, sourceMap);
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
			var selectedData = _.select(data, sourceMap);
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
			var selectedData = _.select(workInfo, sourceMap);
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
			var selectedData = _.selectAll(data);
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
			var selectedData = _.selectAll(data, sourceMap);
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
			var selectedData = _.selectAll(data, sourceMap);
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
			var selectedData = _.selectAll(data, sourceMap);
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
			var selectedData = _.selectAll(workInfo, sourceMap);
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
			fullNameInfo = _.selectAll(fullNameInfoData, {
				name: 'fullName'
			});
		});
		it('With same named match key', function() {
			var joinedCollection = _.joinOn(userInfo, fullNameInfo, 'uid');
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
			var joinedCollection = _.joinOn(userInfo, bankUserInfo, 'uid');
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
			var joinedCollection = _.joinOn(userInfo, bankUserInfo, 'uid', 'customerId');
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
			var joinedCollection = _.joinOn(userInfo, bankUserInfo, 'uid', 'customerId');
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
			fullNameInfo = _.selectAll(fullNameInfoData, {
				name: 'fullName'
			});
		});
		it('With same named match key', function() {
			var joinedCollection = _.leftJoin(userInfo, fullNameInfo, 'uid');
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
			var joinedCollection = _.leftJoin(userInfo, bankUserInfo, 'uid');
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
			var joinedCollection = _.leftJoin(userInfo, bankUserInfo, 'uid', 'customerId');
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
			var joinedCollection = _.leftJoin(userInfo, bankUserInfo, 'uid', 'customerId');
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
			fullNameInfo = _.selectAll(fullNameInfoData, {
				name: 'fullName'
			});
		});
		it('With same named match key', function() {
			var joinedCollection = _.rightJoin(userInfo, fullNameInfo, 'uid');
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
			var joinedCollection = _.rightJoin(userInfo, bankUserInfo, 'uid');
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
			var joinedCollection = _.rightJoin(userInfo, bankUserInfo, 'uid', 'customerId');
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
			var joinedCollection = _.rightJoin(userInfo, bankUserInfo, 'uid', 'customerId');
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
			fullNameInfo = _.selectAll(fullNameInfoData, {
				name: 'fullName'
			});
		});
		it('With same named match key', function() {
			var joinedCollection = _.innerJoin(userInfo, fullNameInfo, 'uid');
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
			var joinedCollection = _.innerJoin(userInfo, bankUserInfo, 'uid');
			expect(joinedCollection.length).to.equal(0);
		});
		it('With differently named keys', function() {
			var joinedCollection = _.innerJoin(userInfo, bankUserInfo, 'uid', 'customerId');
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
			var joinedCollection = _.innerJoin(userInfo, bankUserInfo, 'uid', 'customerId');
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
			fullNameInfo = _.selectAll(fullNameInfoData, {
				name: 'fullName'
			});
		});
		it('With same named match key', function() {
			var joinedCollection = _.fullJoin(userInfo, fullNameInfo, 'uid');
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
			var joinedCollection = _.fullJoin(userInfo, bankUserInfo, 'uid');
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
			var joinedCollection = _.fullJoin(userInfo, bankUserInfo, 'uid', 'customerId');
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
			var joinedCollection = _.fullJoin(userInfo, bankUserInfo, 'uid', 'customerId');
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