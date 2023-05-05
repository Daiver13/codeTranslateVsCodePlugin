// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { outputFileSync, readJsonSync, readdirSync, writeJsonSync } from 'fs-extra';
const kebabCase = require('lodash/kebabCase');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const DEFAULT_LOCALE = 'en-EN';
  let basePath;
  const folders = vscode?.workspace?.workspaceFolders;

  if (folders && folders[0]) {
    basePath = folders[0].uri.path + '/src/locales';
  }

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "codetranslate" is now active!');

	context.subscriptions.push(vscode.commands.registerCommand('CodeTranslate.addKey', async () => {
    if (!basePath) {
      vscode.window.showErrorMessage(`Something went wrong!`);

      return;
    }

    const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
    const selecetedText = editor?.selection;
    const valueSelectedText = editor?.document.getText(selecetedText);

    let inputBoxOptionsKey: vscode.InputBoxOptions = {
      prompt: "Key:",
      placeHolder: "Enter key",
      value: valueSelectedText
    };

    let inputBoxOptionsValue: vscode.InputBoxOptions = {
      prompt: "Value: ",
      placeHolder: "Enter value"
    };

    const resOfInputBoxKey = await vscode.window.showInputBox(inputBoxOptionsKey);
    const resOfInputBoxValue = await vscode.window.showInputBox(inputBoxOptionsValue);

    const key = resOfInputBoxKey;

    const pathArray = key.split(".");
    pathArray[pathArray.length - 1] = kebabCase(pathArray[pathArray.length - 1]);

    const fileJson = readJsonSync(`${basePath}/${DEFAULT_LOCALE}/${pathArray.slice(0, pathArray.length - 1).join('/')}.json`, { throws: false });

    if (!(fileJson === null) && fileJson.hasOwnProperty(pathArray[pathArray.length - 1])) {
      vscode.window.showErrorMessage(`Key "${key}" already exists!`);

      return;
    }

    const langs = await readdirSync(basePath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    if (fileJson === null) {
      langs.forEach(locale => {
        writeJsonSync(`${basePath}/${locale}/${pathArray.slice(0, pathArray.length - 1).join('/')}.json`, {});
      });
    }

    langs.forEach(locale => {
      const localFileJson = readJsonSync(`${basePath}/${locale}/${pathArray.slice(0, pathArray.length - 1).join('/')}.json`);

      if (localFileJson) {
        const res = {...localFileJson, [pathArray[pathArray.length - 1]]: locale === DEFAULT_LOCALE ? resOfInputBoxValue : ''};

        outputFileSync(`${basePath}/${locale}/${pathArray.slice(0, pathArray.length - 1).join('/')}.json`, JSON.stringify(res, null, 2));
      } else {
        outputFileSync(`${basePath}/${locale}/${pathArray.slice(0, pathArray.length - 1).join('/')}.json`, JSON.stringify({}, null, 2));
      }
    });

    vscode.window.showInformationMessage(`Key with name "${key}" has been success added!`);
	}));
}

// This method is called when your extension is deactivated
export function deactivate() {}
