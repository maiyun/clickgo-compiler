import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { LinuxPackager } from 'electron-builder';
import { runIconsTool } from 'app-builder-lib/out/toolsets/icons.js';
import { getPngSize, type IconFormat, type IconInfo } from 'app-builder-lib/out/util/iconConverter.js';

/** --- Linux 打包时将用户配置的单张 PNG 自动转换为桌面图标集 --- */
export class NativeLinuxPackager extends LinuxPackager {

    /** --- 同次打包的多个目标和架构共用转换结果 --- */
    private readonly _iconSets = new Map<string, Promise<IconInfo[]>>();

    /**
     * --- 保留 Builder 的配置解析和查找顺序，仅补充单张 PNG 的多尺寸转换 ---
     * @param sources 图标来源
     * @param fallbackSources 后备图标来源
     * @param outputFormat 输出格式
     * @returns 图标列表
     */
    public override async resolveIcon(
        sources: string[], fallbackSources: string[], outputFormat: IconFormat
    ): Promise<IconInfo[]> {
        const icons = await super.resolveIcon(sources, fallbackSources, outputFormat);
        if ((outputFormat !== 'set') || (icons.length !== 1) || !icons[0].file.endsWith('.png')) {
            return icons;
        }
        const inputFile = path.resolve(icons[0].file);
        const isSinglePng = [...sources, ...fallbackSources].some((source) => {
            const candidates = path.extname(source) ? [source] : [source, `${source}.png`];
            return candidates.some((candidate) => candidate.endsWith('.png') &&
                [this.buildResourcesDir, this.projectDir].some((root) => path.resolve(root, candidate) === inputFile));
        });
        // --- 显式图标目录和其他格式保持原有行为，不重新处理用户提供的图标集 ---
        if (!isSinglePng) {
            return icons;
        }
        let conversion = this._iconSets.get(inputFile);
        if (!conversion) {
            conversion = this._createIconSet(inputFile);
            this._iconSets.set(inputFile, conversion);
        }
        return conversion;
    }

    /**
     * --- 使用 Builder 的图标工具生成标准尺寸，构建结束后清理临时文件 ---
     * @param inputFile 原始 PNG 路径
     * @returns 按尺寸排序的图标列表
     */
    private async _createIconSet(inputFile: string): Promise<IconInfo[]> {
        const { width, height } = await getPngSize(inputFile);
        if ((width !== height) || (width < 256)) {
            throw new Error(`Linux icon must be a square PNG of at least 256x256 pixels: ${inputFile}.`);
        }
        const outDir = await fs.mkdtemp(path.join(os.tmpdir(), 'clickgo-linux-icons-'));
        this.info.disposeOnBuildFinish(() => fs.rm(outDir, { 'recursive': true, 'force': true }));
        console.log('Prepare Linux application icons...');
        await runIconsTool({ 'inputFile': inputFile, 'outputFormat': 'set', 'outDir': outDir });
        const icons: IconInfo[] = [];
        for (const name of await fs.readdir(outDir)) {
            const match = /^(\d+)x(\d+)\.png$/.exec(name);
            if (!match || (match[1] !== match[2])) {
                continue;
            }
            icons.push({ 'file': path.join(outDir, name), 'size': Number(match[1]) });
        }
        if (![16, 32, 48, 128, 256, 512].every((size) => icons.some((icon) => icon.size === size))) {
            throw new Error('The Linux icon tool did not generate the required desktop icon sizes.');
        }
        return icons.sort((a, b) => a.size - b.size);
    }

}
