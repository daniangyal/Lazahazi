/* Copyright (C) 2015-2019 MISTEMS Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

// docs: https://github.com/MaxWhere/mxw-devguide/tree/master/docs
// devtool F6 --> const wom = require('electron').remote.require('maxwhere').wom
// start maxwhere from terminal: start mxw://devopen/%CD%
// start maxwhere from terminal in the component: start mxw://devopen/%CD%/../..
// scrtipts:
//      build: npm run mwbuild
//      watch: npm run watch

import { wom, context, modules, Mesh, Node } from 'maxwhere';

import { ipcMain, BrowserWindow } from 'electron';
import { powerUp, Transform, utils, womAsync } from '@mxw/next';
import SnippetTesting from './snippet_testing';
import path from 'path';

module.exports.init = function () {};

module.exports.done = function (nodeReturnedByRenderFunction: Node) {};

module.exports.render = function (options: object): any {
  initComponent();
  //powerUp.init();

  return wom.create('node', {}); // render always has to return a node (in this case, a dummy node is returned)
};

async function initComponent() {
  
  await womAsync.addResources(path.resolve(__dirname, './resources'));

  let snippetTesting = new SnippetTesting();

}