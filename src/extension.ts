// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
// import kebabCase from "lodash/kebabCase";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "codetranslate" is now active!');

	context.subscriptions.push(vscode.commands.registerCommand('CodeTranslate.addKey', async () => {
    const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
    const selecetedText = editor?.selection;
    const valueSelectedText = editor?.document.getText(selecetedText);

    let key = '';
    let value = '';
    let resOfInputBoxKey = null;

    let inputBoxOptionsKey: vscode.InputBoxOptions = {
      prompt: "Key:",
      placeHolder: "Enter key"
    };

    let inputBoxOptionsValue: vscode.InputBoxOptions = {
      prompt: "Value: ",
      placeHolder: "Enter value"
    };

    if (!valueSelectedText) {
      resOfInputBoxKey = await vscode.window.showInputBox(inputBoxOptionsKey);
    }

    const resOfInputBoxValue = await vscode.window.showInputBox(inputBoxOptionsValue);

    console.log('resOfInputBoxKey', resOfInputBoxKey);
    console.log('resOfInputBoxValue', resOfInputBoxValue);

    // vscode.window.showInputBox(options).then((value) => {
    //   if (!value) return

    //   answer1 = value;

    //   const path = {
    //     common: '',
    //     pages: '',
    //     components: '',
    //   };

    //   console.log('value1', value);
    // });

    // vscode.window.showInputBox(options2).then((value) => {
    //   if (!value) return

    //   answer2 = value;

    //   const path = {
    //     common: '',
    //     pages: '',
    //     components: '',
    //   };

    //   console.log('valu2', value);
    // });
	}));
}

// This method is called when your extension is deactivated
export function deactivate() {}
