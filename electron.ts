/**
 * Project: clickgo-compiler, User: JianSuoQiYue
 * Date: 2026-9-15 12:00:00
 */

import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { extract } from '@electron-internal/extract-zip';
import { downloadArtifact, getHostArch } from '@electron/get';
import electronChecksums from 'electron/checksums.json' with { type: 'json' };
import electronPackage from 'electron/package.json' with { type: 'json' };

/** --- 中国大陆 Electron 下载镜像 --- */
const cnMirror = 'https://npmmirror.com/mirrors/electron/';

/**
 * --- 获取当前系统的用户缓存目录 ---
 * @returns 用户可写缓存目录
 */
function getCacheRoot(): string {
    if (process.env.CLICKGO_ELECTRON_CACHE) {
        return process.env.CLICKGO_ELECTRON_CACHE;
    }
    if (process.platform === 'win32') {
        return process.env.LOCALAPPDATA ?? path.join(os.homedir(), 'AppData', 'Local');
    }
    if (process.platform === 'darwin') {
        return path.join(os.homedir(), 'Library', 'Caches');
    }
    return process.env.XDG_CACHE_HOME ?? path.join(os.homedir(), '.cache');
}

/**
 * --- 获取 Electron 可执行文件在解压目录中的相对路径 ---
 * @returns Electron 可执行文件相对路径
 */
function getExecutableRelativePath(): string {
    switch (process.platform) {
        case 'darwin': {
            return path.join('Electron.app', 'Contents', 'MacOS', 'Electron');
        }
        case 'win32': {
            return 'electron.exe';
        }
        case 'linux':
        case 'freebsd':
        case 'openbsd': {
            return 'electron';
        }
        default: {
            throw new Error(`Electron does not support platform: ${process.platform}.`);
        }
    }
}

/**
 * --- 检查 Electron 运行时是否完整且版本一致 ---
 * @param distPath Electron 解压目录
 * @param executableRelativePath 可执行文件相对路径
 * @returns 是否可以直接运行
 */
async function isRuntimeReady(distPath: string, executableRelativePath: string): Promise<boolean> {
    try {
        const version = (await fs.readFile(path.join(distPath, 'version'), 'utf8')).trim().replace(/^v/, '');
        await fs.access(path.join(distPath, executableRelativePath));
        return version === electronPackage.version;
    }
    catch {
        return false;
    }
}

/**
 * --- 获取可运行的 Electron 二进制文件，缺失时下载到用户缓存目录 ---
 * @param mirror 下载镜像代号
 * @returns Electron 可执行文件绝对路径
 */
export async function getElectronPath(mirror?: string): Promise<string> {
    const arch = getHostArch();
    const executableRelativePath = getExecutableRelativePath();
    const runtimeParentPath = path.join(getCacheRoot(), 'clickgo-compiler', 'electron');
    const runtimePath = path.join(runtimeParentPath, electronPackage.version, `${process.platform}-${arch}`);
    const executablePath = path.join(runtimePath, executableRelativePath);
    if (await isRuntimeReady(runtimePath, executableRelativePath)) {
        return executablePath;
    }

    console.log(`Prepare Electron ${electronPackage.version} runtime...`);
    await fs.mkdir(path.dirname(runtimePath), {
        'recursive': true,
    });
    const tempPath = await fs.mkdtemp(path.join(runtimeParentPath, '.extract-'));
    try {
        const zipPath = await downloadArtifact({
            'version': electronPackage.version,
            'artifactName': 'electron',
            'platform': process.platform,
            'arch': arch,
            'cacheRoot': process.env.electron_config_cache,
            'checksums': electronChecksums,
            'mirrorOptions': mirror === 'cn' ? {
                'mirror': cnMirror,
            } : undefined,
        });
        await extract(zipPath, {
            'dir': tempPath,
        });
        if (!(await isRuntimeReady(tempPath, executableRelativePath))) {
            throw new Error('The downloaded Electron runtime is incomplete.');
        }
        await fs.rm(runtimePath, {
            'recursive': true,
            'force': true,
        });
        await fs.rename(tempPath, runtimePath);
    }
    finally {
        await fs.rm(tempPath, {
            'recursive': true,
            'force': true,
        });
    }
    return executablePath;
}
