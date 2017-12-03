'use strict';

let assert = require('assert');
let semver_sort = require('../../src/lib/utils').semver_sort;
let merge = require('../../src/lib/storage')._merge_versions;

describe('merge versions', function() {

  it('simple', function() {
    let pkg = {
      'versions': {a: 1, b: 1, c: 1},
      'dist-tags': {},
    };

    merge(pkg, {versions: {a: 2, q: 2}});

    assert.deepEqual(pkg, {
      'versions': {a: 1, b: 1, c: 1, q: 2},
      'dist-tags': {},
    });
  });

  it('dist-tags - compat', function() {
    let pkg = {
      'versions': {},
      'dist-tags': {q: '1.1.1', w: '2.2.2'},
    };

    merge(pkg, {'dist-tags': {q: '2.2.2', w: '3.3.3', t: '4.4.4'}});

    assert.deepEqual(pkg, {
      'versions': {},
      'dist-tags': {q: '2.2.2', w: '3.3.3', t: '4.4.4'},
    });
  });

  it('dist-tags - staging', function() {

    let pkg = {
      versions: {},
      // we've been locally publishing 1.1.x in preparation for the next
      // public release
      'dist-tags': {q:'1.1.10',w:'2.2.2'},
    };
    // 1.1.2 is the latest public release, but we want to continue testing
    // against our local 1.1.10, which may end up published as 1.1.3 in the
    // future

    merge(pkg, {'dist-tags':{q:'1.1.2',w:'3.3.3',t:'4.4.4'}})

    assert.deepEqual(pkg, {
      versions: {},
      'dist-tags': {q:'1.1.10',w:'3.3.3',t:'4.4.4'},
    });

  });

  it('semver_sort', function() {

    assert.deepEqual(semver_sort(['1.2.3', '1.2', '1.2.3a', '1.2.3c', '1.2.3-b']),
    ['1.2.3a',
      '1.2.3-b',
      '1.2.3c',
      '1.2.3']
    );

  });

});

