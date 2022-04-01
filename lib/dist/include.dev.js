"use strict";

var _require = require('fs'),
    readFileSync = _require.readFileSync;

var _require2 = require('@rollup/pluginutils'),
    createFilter = _require2.createFilter;

var PATTERN = /\/\/ *(.*)@include *\( *([^ \)]+) *\)(.*)/g;

module.exports = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var filter = createFilter(options.include, options.exclude); //---- properties ----

  var name = 'include'; //---- hooks ----

  function transform(code, id) {
    if (!filter(id)) return;
    return code.replace(PATTERN, function (line, head, path, tail) {
      path = require.resolve(path);
      return head + readFileSync(path, 'utf-8') + tail;
    });
  }

  return {
    name: name,
    transform: transform
  };
};