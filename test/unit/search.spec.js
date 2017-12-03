'use strict';

let assert = require('assert');
let Search = require('../../src/lib/search');
let Storage = require('../../src/lib/storage');
let config_hash = require('./partials/config');
let Config = require('../../src/lib/config');

require('../../src/lib/logger')({level: 'silent'});

let packages = [
	{
		name: 'test1',
		description: 'description',
		_npmUser: {
			name: 'test_user',
		},
	},
	{
		name: 'test2',
		description: 'description',
		_npmUser: {
			name: 'test_user',
		},
	},
	{
		name: 'test3',
		description: 'description',
		_npmUser: {
			name: 'test_user',
		},
	},
];

describe('search', function() {
	before(function() {
		let config = new Config(config_hash);
		this.storage = new Storage(config);
		Search.configureStorage(this.storage);
		packages.map(function(item) {
			Search.add(item);
		});
	});

	it('search query item', function() {
		let result = Search.query('t');
		assert(result.length === 3);
	});

	it('search remove item', function() {
		let item = {
			name: 'test6',
			description: 'description',
			_npmUser: {
				name: 'test_user',
			},
		};
		Search.add(item);
		let result = Search.query('test6');
		assert(result.length === 1);
		Search.remove(item.name);
		result = Search.query('test6');
		assert(result.length === 0);
	});
});
