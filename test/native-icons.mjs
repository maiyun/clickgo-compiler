// Run after npx tsc: node --experimental-vm-modules test/native-icons.mjs [--deb]
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { deflateSync } from 'node:zlib';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
import { SourceTextModule, SyntheticModule } from 'node:vm';
import { runIconsTool } from 'app-builder-lib/out/toolsets/icons.js';
import { getPngSize } from 'app-builder-lib/out/util/iconConverter.js';

function png(size) {
    const chunk = (type, data) => {
        const body = Buffer.concat([Buffer.from(type), data]);
        let crc = 0xffffffff;
        for (const byte of body) {
            crc ^= byte;
            for (let bit = 0; bit < 8; ++bit) { crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0); }
        }
        const result = Buffer.alloc(body.length + 8);
        result.writeUInt32BE(data.length);
        body.copy(result, 4);
        result.writeUInt32BE((crc ^ 0xffffffff) >>> 0, result.length - 4);
        return result;
    };
    const header = Buffer.alloc(13);
    header.writeUInt32BE(size);
    header.writeUInt32BE(size, 4);
    header[8] = 8;
    header[9] = 6;
    const pixels = Buffer.alloc((size * 4 + 1) * size, 128);
    for (let row = 0; row < size; ++row) { pixels[row * (size * 4 + 1)] = 0; }
    return Buffer.concat([Buffer.from('89504e470d0a1a0a', 'hex'), chunk('IHDR', header),
        chunk('IDAT', deflateSync(pixels)), chunk('IEND', Buffer.alloc(0))]);
}
function synthetic(exports) {
    return new SyntheticModule(Object.keys(exports), function() {
        for (const [name, value] of Object.entries(exports)) { this.setExport(name, value); }
    });
}
const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'clickgo-icon-test-'));
const disposers = [];
try {
    const inputFile = path.join(projectDir, 'logo.png');
    const original = png(1024);
    await fs.writeFile(inputFile, original);
    let conversions = 0;
    let toolFails = false;
    class LinuxPackager {
        constructor(info) {
            this.info = info;
            this.projectDir = projectDir;
            this.buildResourcesDir = path.join(projectDir, 'resources');
        }
        async resolveIcon() { return this.info.icons; }
    }
    const mod = new SourceTextModule(await fs.readFile(new URL('../native.js', import.meta.url), 'utf8'));
    const modules = {
        'fs/promises': synthetic(fs), 'os': synthetic(os), 'path': synthetic(path),
        'electron-builder': synthetic({ LinuxPackager }),
        'app-builder-lib/out/util/iconConverter.js': synthetic({ getPngSize }),
        'app-builder-lib/out/toolsets/icons.js': synthetic({ async runIconsTool(options) {
            ++conversions;
            if (toolFails) { throw new Error('Simulated icon-tool failure'); }
            await runIconsTool(options);
        } }),
    };
    await mod.link(name => modules[name]);
    await mod.evaluate();
    const create = (icons) => new mod.namespace.NativeLinuxPackager({ icons,
        disposeOnBuildFinish(callback) { disposers.push(callback); } });
    const packager = create([{ file: inputFile, size: 1024 }]);
    const results = await Promise.all(Array.from({ length: 4 }, () => packager.resolveIcon(['logo.png'], [], 'set')));
    assert.equal(conversions, 1);
    assert.equal(disposers.length, 1);
    const icons = results[0];
    for (const result of results) { assert.equal(result, icons); }
    assert.deepEqual(icons.map(icon => icon.size), [16, 24, 32, 48, 64, 128, 256, 512]);
    for (const icon of icons) {
        assert.deepEqual(await getPngSize(icon.file), { width: icon.size, height: icon.size });
        assert.equal(icon.file.startsWith(`${projectDir}${path.sep}`), false);
    }
    assert.deepEqual(await fs.readFile(inputFile), original);
    assert.equal(await packager.resolveIcon(['logo'], [], 'set'), icons);
    assert.equal(await packager.resolveIcon([inputFile], [], 'set'), icons);
    await fs.mkdir(path.join(projectDir, 'resources'));
    const resourceFile = path.join(projectDir, 'resources', 'logo.png');
    await fs.writeFile(resourceFile, original);
    const resourceIcons = await create([{ file: resourceFile, size: 1024 }]).resolveIcon(['logo.png'], [], 'set');
    assert.equal(resourceIcons.length, 8);

    for (const [sources, result, format] of [
        [['icons'], [{ file: path.join(projectDir, 'icons', '512x512.png'), size: 512 }], 'set'],
        [['logo.svg'], [{ file: path.join(projectDir, 'logo.svg'), size: 1024 }], 'set'],
        [['logo.png'], [{ file: inputFile, size: 1024 }], 'ico'],
        [['missing.png'], [], 'set'],
    ]) {
        const before = conversions;
        assert.equal(await create(result).resolveIcon(sources, [], format), result);
        assert.equal(conversions, before);
    }
    const smallFile = path.join(projectDir, 'small.png');
    await fs.writeFile(smallFile, png(16));
    await assert.rejects(create([{ file: smallFile, size: 16 }]).resolveIcon(['small.png'], [], 'set'), /at least 256/);
    toolFails = true;
    await assert.rejects(create([{ file: inputFile, size: 1024 }]).resolveIcon(['logo.png'], [], 'set'), /Simulated/);
    const generatedDir = path.dirname(icons[0].file);
    await Promise.all(disposers.splice(0).map(dispose => dispose()));
    await assert.rejects(fs.access(generatedDir));
    assert.deepEqual(await fs.readFile(inputFile), original);
    const changed = png(512);
    await fs.writeFile(inputFile, changed);
    toolFails = false;
    const nextBuild = await create([{ file: inputFile, size: 512 }]).resolveIcon(['logo.png'], [], 'set');
    assert.notEqual(path.dirname(nextBuild[0].file), generatedDir);
    assert.deepEqual(await fs.readFile(inputFile), changed);
    await Promise.all(disposers.splice(0).map(dispose => dispose()));
    await fs.writeFile(inputFile, original);
    console.log('Linux icon generation, reuse, directory compatibility and cleanup checks passed.');

    if (process.argv.includes('--deb')) {
        const { build, Platform } = await import('electron-builder');
        const { NativeLinuxPackager } = await import('../native.js');
        const unpacked = path.join(projectDir, 'unpacked');
        await fs.mkdir(unpacked);
        await fs.mkdir(path.join(unpacked, 'resources'));
        await fs.writeFile(path.join(unpacked, 'icon-test'), '#!/bin/sh\nexit 0\n', { mode: 0o755 });
        const metadata = { name: 'icon-test', version: '1.0.0', description: 'Icon packaging regression fixture',
            homepage: 'https://example.invalid',
            main: 'index.js', author: { name: 'Test', email: 'test@example.invalid' }, build: {
                appId: 'org.example.icon-test', productName: 'Icon Test', publish: null,
                directories: { output: 'output' }, linux: {
                    icon: 'logo.png', category: 'Utility',
                    target: [{ target: 'deb', arch: ['x64', 'arm64'] }],
                },
            } };
        await fs.writeFile(path.join(projectDir, 'package.json'), JSON.stringify(metadata));
        const generatedFiles = new Set();
        class TestPackager extends NativeLinuxPackager {
            async resolveIcon(...params) {
                const icons = await super.resolveIcon(...params);
                for (const icon of icons) { generatedFiles.add(icon.file); }
                return icons;
            }
        }
        const artifacts = await build({ projectDir, prepackaged: unpacked,
            targets: Platform.LINUX.createTarget(),
            config: { electronVersion: '44.3.0' },
            platformPackagerFactory: info => new TestPackager(info),
        });
        assert.equal(artifacts.length, 2);
        for (const artifact of artifacts) {
            const { stdout: architecture } = await promisify(execFile)('dpkg-deb', ['--field', artifact, 'Architecture']);
            assert.equal(architecture.trim(), artifact.includes('_amd64.') ? 'amd64' : 'arm64');
            const { stdout } = await promisify(execFile)('dpkg-deb', ['--contents', artifact]);
            for (const size of [16, 24, 32, 48, 64, 128, 256, 512]) {
                assert.ok(stdout.includes(`hicolor/${size}x${size}/apps/icon-test.png`), `Missing ${size}px icon`);
            }
            assert.ok(stdout.includes('applications/icon-test.desktop'));
        }
        assert.deepEqual(JSON.parse(await fs.readFile(path.join(projectDir, 'package.json'), 'utf8')), metadata);
        assert.equal(generatedFiles.size, 8);
        for (const file of generatedFiles) { await assert.rejects(fs.access(file)); }
        console.log('Actual x64 and ARM64 DEB packages contain all eight desktop icon sizes.');
    }
}
finally {
    await Promise.all(disposers.map(dispose => dispose()));
    await fs.rm(projectDir, { recursive: true, force: true });
}
