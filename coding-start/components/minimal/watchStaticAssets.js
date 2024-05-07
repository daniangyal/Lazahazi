const path = require('path');
const chokidar = require('chokidar');
const fse = require('fs-extra');

addWatcher(
  path.resolve(__dirname, 'src/resources'),
  path.resolve(__dirname, 'mwdist/resources'),
);


function addWatcher(srcPath, distPath) {
  chokidar
    .watch(srcPath)
    .on('add', (srcFilePath) => {
      let relativePath = path.relative(srcPath, srcFilePath);
      fse.copy(
        path.resolve(__dirname, srcFilePath),
        path.resolve(__dirname, distPath, relativePath),
      );
    })
    .on('change', (srcFilePath) => {
      let relativePath = path.relative(srcPath, srcFilePath);
      fse.copy(
        path.resolve(__dirname, srcFilePath),
        path.resolve(__dirname, distPath, relativePath),
      );
    })
    .on('unlink', (srcFilePath) => {
      let relativePath = path.relative(srcPath, srcFilePath);
      fse.remove(path.resolve(__dirname, distPath, relativePath));
    });
}
