import chalk from 'chalk';
import cp from 'child_process';
import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';

const validateProjectName = (projectName: string): boolean => {
	const error = (errMsg: string) => {
		console.log(chalk.red(`× ${errMsg}`));
	};

	if (!projectName) {
		error('请输入项目名');
		return false;
	}
	if (/[\\:*?"<>|]/.test(projectName)) {
		error('请输入合法文件名');
		return false;
	}
	return true;
};

const initProjectDirectory = async (projectName: string, projectDir: string) => {
	// 判断当前文件夹下是否有目标路径的目录
	if (fs.existsSync(projectDir)) {
		console.log(chalk.red(`Folder named '${projectName}' has already been existed`));
		process.exit(-1);
	}

	// 创建文件夹
	await fs.promises.mkdir(projectDir, { recursive: true });
};

function pkgFromUserAgent(userAgent: string | undefined) {
	if (!userAgent) return undefined;
	const pkgSpec = userAgent.split(' ')[0];
	const pkgSpecArr = pkgSpec.split('/');
	return {
		name: pkgSpecArr[0],
		version: pkgSpecArr[1],
	};
}

const copyTemplate = async (targetDir: string) => {
	const templateDir = path.resolve(__dirname, '..', 'template');
	await fse.copy(templateDir, targetDir);

	/**
	 * 重命名 .gitignore
	 * 因为 npm 会将 .gitignore 重命名为 .npmignore
	 */
	await fse.rename(
		path.resolve(targetDir, 'kira.gitignore'),
		path.resolve(targetDir, '.gitignore')
	);

	// 安装依赖
	console.log(chalk.green('正在为您安装依赖'));
	const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
	const pkgManager = pkgInfo ? pkgInfo.name : 'npm';
	try {
		cp.execSync(`${pkgManager} install`, {
			cwd: targetDir,
			stdio: 'inherit',
		});
	} catch (e) {
		return;
	}

	// cSpell: disable-next-line
	console.log(chalk.green('Ciallo~ ( ∠·ω< )⌒★ 博客初始化完成辣！'));
	console.log(
		chalk.white('kira-hexo 使用文档请访问'),
		chalk.cyan('https://kira.host/hexo/'),
		chalk.white('哦！')
	);
};

export default async function (dirName: string) {
	if (!validateProjectName(dirName)) return;

	// 目标根路径，process.cwd() 为脚手架工作时的路径，将其与用户输入的项目名称拼接起来作为目标路径
	const blogDirPath = path.resolve(process.cwd(), dirName);
	await initProjectDirectory(dirName, blogDirPath);
	await copyTemplate(blogDirPath);
}
