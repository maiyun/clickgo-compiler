import * as cleancss from 'clean-css';
import * as fs from 'fs';
import * as terser from 'terser';
import zip from 'jszip';
const cs = new cleancss.default();

/**
 * --- 去除 html 的空白符、换行 ---
 * @param text 要纯净的字符串
 */
function purify(text: string): string {
    text = '>' + text + '<';
    text = text.replace(/<!--([\s\S]*?)-->/g, '').replace(/>([\s\S]*?)</g, function(t: string, t1: string) {
        return '>' + t1.replace(/\t|\r\n| {2}/g, '').replace(/\n|\r/g, '') + '<';
    });
    return text.slice(1, -1);
}

/**
 * --- 添加包含 config.json 的包文件到 zip ---
 * @param zipo zip 对象
 * @param base 包含 config 的路径，不以 / 结尾
 * @param path zip 中的路径基，不以 / 结尾
 */
async function addFile(zipo: zip, base: string = '', path: string = ''): Promise<void> {
    const list = await fs.promises.readdir(base);
    for (const item of list) {
        try {
            const stat = await fs.promises.lstat(base + '/' + item);
            if (stat.isDirectory()) {
                await addFile(zipo, base + '/' + item, path + (path ? '/' : '') + item);
                continue;
            }
            if (item.endsWith('.ts') || item.endsWith('.scss')) {
                continue;
            }
            const buf = await fs.promises.readFile(base + '/' + item);
            if (item.endsWith('.html') || item.endsWith('.xml')) {
                // --- 为了去除 html 中的空白和注释 ---
                zipo.file(path + (path ? '/' : '') + item, purify(buf.toString()));
            }
            else if (item.endsWith('.js')) {
                // --- 压缩 js ---
                const rtn = await terser.minify(buf.toString());
                zipo.file(path + (path ? '/' : '') + item, rtn.code ?? '');
            }
            else if (item.endsWith('.css')) {
                // --- 压缩 css ---
                const rtn = cs.minify(buf.toString());
                zipo.file(path + (path ? '/' : '') + item, rtn.styles ?? '');
            }
            else {
                zipo.file(path + (path ? '/' : '') + item, buf);
            }
        }
        catch {
            continue;
        }
    }
}

/**
 * --- 编译控件源码为 cgc 文件 ---
 * @param paths 控件源码路径，后缀无所谓是否 / 结尾
 * @param save 保存文件路径，不能以 / 结尾，不要带扩展名
 */
export async function control(paths: string[], save?: string): Promise<number> {
    const zipo = new zip();
    /** --- 保存的文件名 --- */
    let name = '';
    /** --- 控件的个数 --- */
    let num = 0;
    for (let path of paths) {
        if (path.endsWith('/')) {
            path = path.slice(0, -1);
        }
        let json: any = {};
        try {
            const buf = await fs.promises.readFile(path + '/config.json');
            json = JSON.parse(buf.toString());
        }
        catch (e) {
            console.log('ERROR', e);
            return 0;
        }
        const cname = json.name;
        if (!name) {
            name = cname;
        }
        await addFile(zipo, path, cname);
        ++num;
    }
    // --- 保存位置 ---
    if (save) {
        if (save.endsWith('/')) {
            save += name;
        }
    }
    else {
        save = name;
    }
    // -- 筹备 zip 包 ---
    const buf = await zipo.generateAsync({
        'type': 'nodebuffer',
        'compression': 'DEFLATE',
        'compressionOptions': {
            'level': 9
        }
    });
    await fs.promises.writeFile(save + '.cgc', buf);
    return num;
}

/**
 * --- 编译控件源码为 cgc 文件 ---
 * @param path 应用源码路径，后缀无所谓是否 / 结尾
 * @param icon 应用图标文件图片完整路径
 * @param save 保存文件路径，不能以 / 结尾，不要带扩展名
 */
export async function application(path: string, icon?: string, save?: string): Promise<boolean> {
    const zipo = new zip();
    if (path.endsWith('/')) {
        path = path.slice(0, -1);
    }
    const lio = path.lastIndexOf('/');
    /** --- 保存的文件名 --- */
    const name = lio === -1 ? path : path.slice(lio + 1);
    await addFile(zipo, path, '');
    // --- 处理 icon ---
    let iconBuf: Buffer;
    if (icon) {
        const iconFile = await fs.promises.readFile(icon);
        if (iconFile) {
            const length = iconFile.length.toString().padStart(7, '0');
            iconBuf = Buffer.concat([Buffer.from(length), iconFile]);
        }
        else {
            iconBuf = Buffer.from('0000000');
        }
    }
    else {
        iconBuf = Buffer.from('0000000');
    }
    // --- 保存位置 ---
    if (save) {
        if (save.endsWith('/')) {
            save += name;
        }
    }
    else {
        save = name;
    }
    // -- 筹备 zip 包 ---
    let buf = await zipo.generateAsync({
        'type': 'nodebuffer',
        'compression': 'DEFLATE',
        'compressionOptions': {
            'level': 9
        }
    });
    buf = Buffer.concat([Buffer.from('-CGA-'), buf.subarray(0, 16), iconBuf, buf.subarray(16)]);
    await fs.promises.writeFile(save + '.cga', buf);
    return true;
}