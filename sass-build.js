/**
 * For Production
 * https://github.com/jtangelder/sass-loader#problems-with-url
 * Executed after build
 */
var replace = require('replace');

replace({
  regex: 'media\/',
  replacement: '..\/media\/',
  paths: ['./dist/css'],
  recursive: true,
  silent: true,
});
