import * as vscode from 'vscode';
import Gsc from './Gsc';

interface ISelectorMap {
	[router: string]: boolean;
}

const pickMode: string[] = ['默认配置', '自选配置'];
const pickItems: string[] = ['无需页面文件', 'store', 'router', 'components', 'config', 'constants', 'utils', 'helpers'];

function genCode(rootPath: string, gsc: Gsc, configuration: vscode.WorkspaceConfiguration): void {
	gsc.updatePath(rootPath);

	let folderConfig: object = configuration.folders;
	let fileConfig: any = JSON.parse(JSON.stringify(configuration.files));
	let genCode: boolean = true;

	vscode.window.showQuickPick(pickMode).then(async (selector) => {
		if (selector === pickMode[1]) {
			// 自行选择
			const seletors = await vscode.window.showQuickPick(pickItems, {
				canPickMany: true
			});
			const selectorsMap: ISelectorMap = {};
			(seletors as string[]).forEach(item => {
				const folderName: string = item.replace('(默认)', '');
				// 如果选择了router，就生成router对应的文件
				if (item === pickItems[2]) {
					fileConfig['router.js'] = true;
					fileConfig = fileConfig;
					return;
				}
				// 不需要页面文件
				if (item === pickItems[0]) {
					genCode = false;
					return;
				}
				selectorsMap[folderName] = true;
			});
			folderConfig = selectorsMap;
		}
		gsc.mkdirs(folderConfig);
		if(genCode === true) {
			gsc.writeFile(fileConfig);
		}
		vscode.window.showInformationMessage('生成完毕');
	});
}

export async function activate(context: vscode.ExtensionContext) {
	const configuration = vscode.workspace.getConfiguration('GenCodeStyle');
	const gsc = new Gsc;

	// 文件夹右击生成
	const menuGenCode: vscode.Disposable = vscode.commands.registerCommand('extension.gsc.menusGenCodeStyle', async (uri) => {
		genCode(uri.path, gsc, configuration);
	});

	// 命令行生成
	const cmdGenCode: vscode.Disposable = vscode.commands.registerCommand('extension.gsc.cmdGenCodeStyle', async () => {
		const pagePath = `${vscode.workspace.rootPath}/client/pages`;
		const inputValue = await vscode.window.showInputBox({ placeHolder: '项目名称' });
		const projectPath = `${pagePath}/${inputValue}`;
		if (gsc.createFolder(projectPath)) {
			genCode(projectPath, gsc, configuration);
		}
	});

	context.subscriptions.push(menuGenCode, cmdGenCode);
}

// this method is called when your extension is deactivated
export function deactivate() {}
