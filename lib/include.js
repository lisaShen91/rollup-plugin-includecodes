const { readFileSync } = require('fs');
const { createFilter } = require('@rollup/pluginutils');

const PATTERN = /\/\/ *(.*)@include *\( *([^ \)]+) *\)(.*)/g;

module.exports = (options = {}) => {

  const filter = createFilter(options.include, options.exclude);

  //---- properties ----

  const name = 'include';

  //---- hooks ----

  function transform(code, id)
  {
    if(!filter(id))
      return;

    return code.replace(PATTERN, (line, head, path, tail) => {
      path = require.resolve(path);
      return head + readFileSync(path, 'utf-8') + tail;
    });
  }

  return { name, transform };
}
