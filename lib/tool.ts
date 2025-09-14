/**
 * Copyright 2007-2025 MAIYUN.NET
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * --- 去除 html 的空白符、换行以及注释 ---
 * @param text 要纯净的字符串
 */
export function purify(text: string): string {
    text = '>' + text + '<';
    const scripts: string[] = [];
    let num: number = -1;
    text = text.replace(/<!--([\s\S]*?)-->/g, '').replace(/<script[\s\S]+?<\/script>/g, function(t: string): string {
        scripts.push(t);
        return '[SCRIPT]';
    }).replace(/>([\s\S]*?)</g, function(t: string, t1: string): string {
        return '>' + t1.replace(/\t|\r\n| {2}/g, '').replace(/\n|\r/g, '') + '<';
    }).replace(/\[SCRIPT\]/g, function(): string {
        ++num;
        return scripts[num];
    });
    return text.slice(1, -1);
}

/**
 * --- 传输 url 并解析为 IUrl 对象 ---
 * @param url url 字符串
 */
export function parseUrl(url: string): IUrl {
    // --- test: https://ab-3dc:aak9()$@github.com:80/nodejs/node/blob/master/lib/url.js?mail=abc@def.com#223 ---
    const rtn: IUrl = {
        'protocol': null,
        'auth': null,
        'user': null,
        'pass': null,
        'host': null,
        'hostname': null,
        'port': null,
        'pathname': '/',
        'path': null,
        'query': null,
        'hash': null
    };
    const hash = url.indexOf('#');
    if (hash > -1) {
        rtn['hash'] = url.slice(hash + 1);
        url = url.slice(0, hash);
    }
    const query = url.indexOf('?');
    if (query > -1) {
        rtn['query'] = url.slice(query + 1);
        url = url.slice(0, query);
    }
    const protocol = url.indexOf(':');
    if (protocol > -1) {
        rtn['protocol'] = url.slice(0, protocol + 1).toLowerCase();
        url = url.slice(protocol + 1);
        if (url.startsWith('//')) {
            url = url.slice(2);
        }
        let path = url.indexOf('/');
        if (path === -1) {
            path = url.indexOf('\\');
        }
        if (path > -1) {
            rtn['pathname'] = url.slice(path);
            url = url.slice(0, path);
        }
        const auth = url.indexOf('@');
        if (auth > -1) {
            const authStr = url.slice(0, auth);
            const authSplit = authStr.indexOf(':');
            if (authSplit > -1) {
                // --- 有密码 ---
                rtn['user'] = authStr.slice(0, authSplit);
                rtn['pass'] = authStr.slice(authSplit + 1);
                rtn['auth'] = rtn['user'] + ':' + rtn['pass'];
            }
            else {
                rtn['user'] = authStr;
                rtn['auth'] = authStr;
            }
            url = url.slice(auth + 1);
        }
        if (url) {
            const port = url.indexOf(':');
            if (port > -1) {
                rtn['hostname'] = url.slice(0, port).toLowerCase();
                rtn['port'] = url.slice(port + 1);
                rtn['host'] = rtn['hostname'] + (rtn['port'] ? ':' + rtn['port'] : '');
            }
            else {
                rtn['hostname'] = url.toLowerCase();
                rtn['host'] = rtn['hostname'];
            }
        }
    }
    else {
        // --- 没有 protocol ---
        rtn['pathname'] = url;
    }
    // --- 组合 ---
    rtn['path'] = rtn['pathname'] + (rtn['query'] ? '?' + rtn['query'] : '');
    return rtn;
}

/**
 * --- 将相对路径根据基准路径进行转换 ---
 * @param from 基准路径
 * @param to 相对路径
 */
export function urlResolve(from: string, to: string): string {
    from = from.replace(/\\/g, '/');
    to = to.replace(/\\/g, '/');
    // --- to 为空，直接返回 form ---
    if (to === '') {
        return urlAtom(from);
    }
    // --- 获取 from 的 scheme, host, path ---
    const f = parseUrl(from);
    // --- 以 // 开头的，加上 from 的 protocol 返回 ---
    if (to.startsWith('//')) {
        return urlAtom(f.protocol ? f.protocol + to : to);
    }
    if (f.protocol) {
        // --- 获取小写的 protocol ---
        from = f.protocol + from.slice(f.protocol.length);
    }
    // --- 获取 to 的 scheme, host, path ---
    const t = parseUrl(to);
    // --- 已经是绝对路径，直接返回 ---
    if (t.protocol) {
        // --- 获取小写的 protocol ---
        return urlAtom(t.protocol + to.slice(t.protocol.length));
    }
    // --- # 或 ? 替换后返回 ---
    if (to.startsWith('#') || to.startsWith('?')) {
        const sp = from.indexOf(to[0]);
        if (sp !== -1) {
            return urlAtom(from.slice(0, sp) + to);
        }
        else {
            return urlAtom(from + to);
        }
    }
    // --- 处理后面的尾随路径 ---
    let abs = (f.auth ? f.auth + '@' : '') + (f.host ?? '');
    if (to.startsWith('/')) {
        // -- abs 类似是 /xx/xx ---
        abs += to;
    }
    else {
        // --- to 是 xx/xx 这样的 ---
        // --- 移除基准 path 不是路径的部分，如 /ab/c 变成了 /ab，/ab 变成了 空 ---
        const path = f.pathname.replace(/\/[^/]*$/g, '');
        // --- abs 是 /xx/xx 了，因为如果 path 是空，则跟上了 /，如果 path 不为空，也是 / 开头 ---
        abs += path + '/' + to;
    }
    // --- 返回最终结果 ---
    if (f.protocol && (f.protocol !== 'file:') && !f.host) {
        // --- 类似 c:/ ---
        return urlAtom(f.protocol + abs);
    }
    else {
        // --- 类似 http:// ---
        return urlAtom((f.protocol ? f.protocol + '//' : '') + abs);
    }
}

/** --- 处理 URL 中的 .. / . 等 --- */
export function urlAtom(url: string): string {
    // --- 删掉 ./ ---
    while (url.includes('/./')) {
        url = url.replace(/\/\.\//g, '/');
    }
    // --- 删掉 ../ ---
    while (/\/(?!\.\.)[^/]+\/\.\.\//.test(url)) {
        url = url.replace(/\/(?!\.\.)[^/]+\/\.\.\//g, '/');
    }
    url = url.replace(/\.\.\//g, '');
    return url;
}

// --- 类型 ---

/** --- 网址对象 --- */
export interface IUrl {
    'auth': string | null;
    'hash': string | null;
    'host': string | null;
    'hostname': string | null;
    'pass': string | null;
    'path': string | null;
    'pathname': string;
    'protocol': string | null;
    'port': string | null;
    'query': string | null;
    'user': string | null;
}
