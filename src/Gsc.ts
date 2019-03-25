import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as _ from 'lodash';
import { renderString } from 'nunjucks';
import initialJs from './tpl/initial-js';

interface IFillConfig {
  "main.js": boolean;
  "App.vue": object;
  "router.js": boolean;
}

class Gsc {
  private path: string = '';

  private storeFiles: string[] = ['index', 'state', 'getters', 'mutations', 'actions'];

  // cmd生成项目文件夹
  public createFolder(path: string): boolean {
    if (fs.existsSync(path)) {
      vscode.window.showErrorMessage('文件夹已存在!');
      return false;
    }
    fs.mkdirSync(path);
    return true;
  }

  public updatePath(path: string): void {
    this.path = path;
  }

  public mkdirs(config: object): void | boolean {
    _.each(config, (item, key) => {
      const currentPath = this.path + '/' + key;
      // 文件存在不生成
      if (fs.existsSync(currentPath)) {
        vscode.window.showErrorMessage(`文件夹${key}已存在`);
        return false;
      }

      let fileExtension: string = '.js';
      let fileContent: string = initialJs.JS;

      // components和view默认是vue文件
      if (key === 'components' || key === 'view') {
        fileExtension = '.vue';
        fileContent = initialJs.Vue;
      }

      if (item === true) {
        fs.mkdirSync(currentPath);
        // store的文件
        if (key === 'store') {
          _.each(this.storeFiles, file => {
            fileContent = renderString(initialJs.Store.other, { exportName: file });
            // index默认写入Vuex初始化代码
            if (file === 'index') {
              fileContent = initialJs.Store.index;
            }
            fs.writeFileSync(`${currentPath}/${file}${fileExtension}`, fileContent, {
              encoding: 'utf8'
            });
          });
        } else {
          fs.writeFileSync(`${currentPath}/index${fileExtension}`, fileContent, {
            encoding: 'utf8'
          });
        }
      }
    });
  }

  public writeFile(config: IFillConfig): void | boolean {
    let appContent: string = initialJs.App.default;
    _.each(config, (item, key) => {
      const filePath: string = `${this.path}/${key}`;
      // 文件存在不生成
      if (fs.existsSync(filePath)) {
        vscode.window.showErrorMessage(`文件${key}已存在`);
        return false;
      }
      if (key === 'App.vue' && config['router.js'] === true) {
        // 使用router
        appContent = initialJs.App.router;
      } else if (key === 'App.vue'){
        appContent = initialJs.App.default;
      } else {
        const fileName: string = key.replace(/\..*/, '');
        appContent = initialJs[fileName];
      }
      if (item === true) {
        fs.writeFile(filePath, appContent);
      }
    });
  }
}

export default Gsc;
