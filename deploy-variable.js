/**
 * For Production
 * https://github.com/jtangelder/sass-loader#problems-with-url
 * Executed after build
 */
var replace = require('replace');

replace({
  regex: 'css\/',
  replacement: '\$deployVariable\/css\/',
  paths: ['./dist/index.html'],
  recursive: true,
  silent: true,
});

replace({
  regex: 'js\/',
  replacement: '\$deployVariable\/js\/',
  paths: ['./dist/index.html'],
  recursive: true,
  silent: true,
});

replace({
  regex: '\/dev\/',
  replacement: '\/\$ensightenVariable\/js\/',
  paths: ['./dist/index.html'],
  recursive: true,
  silent: true,
});
