export function purify(text) {
    text = '>' + text + '<';
    const scripts = [];
    let num = -1;
    text = text.replace(/<!--([\s\S]*?)-->/g, '').replace(/<script[\s\S]+?<\/script>/g, function (t) {
        scripts.push(t);
        return '[SCRIPT]';
    }).replace(/>([\s\S]*?)</g, function (t, t1) {
        return '>' + t1.replace(/\t|\r\n| {2}/g, '').replace(/\n|\r/g, '') + '<';
    }).replace(/\[SCRIPT\]/g, function () {
        ++num;
        return scripts[num];
    });
    return text.slice(1, -1);
}
export function parseUrl(url) {
    const rtn = {
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
        rtn['pathname'] = url;
    }
    rtn['path'] = rtn['pathname'] + (rtn['query'] ? '?' + rtn['query'] : '');
    return rtn;
}
export function urlResolve(from, to) {
    from = from.replace(/\\/g, '/');
    to = to.replace(/\\/g, '/');
    if (to === '') {
        return urlAtom(from);
    }
    const f = parseUrl(from);
    if (to.startsWith('//')) {
        return urlAtom(f.protocol ? f.protocol + to : to);
    }
    if (f.protocol) {
        from = f.protocol + from.slice(f.protocol.length);
    }
    const t = parseUrl(to);
    if (t.protocol) {
        return urlAtom(t.protocol + to.slice(t.protocol.length));
    }
    if (to.startsWith('#') || to.startsWith('?')) {
        const sp = from.indexOf(to[0]);
        if (sp !== -1) {
            return urlAtom(from.slice(0, sp) + to);
        }
        else {
            return urlAtom(from + to);
        }
    }
    let abs = (f.auth ? f.auth + '@' : '') + (f.host ?? '');
    if (to.startsWith('/')) {
        abs += to;
    }
    else {
        const path = f.pathname.replace(/\/[^/]*$/g, '');
        abs += path + '/' + to;
    }
    if (f.protocol && (f.protocol !== 'file:') && !f.host) {
        return urlAtom(f.protocol + abs);
    }
    else {
        return urlAtom((f.protocol ? f.protocol + '//' : '') + abs);
    }
}
export function urlAtom(url) {
    while (url.includes('/./')) {
        url = url.replace(/\/\.\//g, '/');
    }
    while (/\/(?!\.\.)[^/]+\/\.\.\//.test(url)) {
        url = url.replace(/\/(?!\.\.)[^/]+\/\.\.\//g, '/');
    }
    url = url.replace(/\.\.\//g, '');
    return url;
}
