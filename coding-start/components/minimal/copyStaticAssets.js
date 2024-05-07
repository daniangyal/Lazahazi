const path = require('path');
const fse = require('fs-extra');

fse.copy(
  path.resolve(__dirname, 'src/resources'),
  path.resolve(__dirname, 'mwdist/resources'),
);


