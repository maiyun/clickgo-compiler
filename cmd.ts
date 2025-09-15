/**
 * Project: clickgo-compiler, User: JianSuoQiYue
 * Date: 2024-2-20 15:40:13, 2025-5-27 00:06:51, 2025-9-13 01:09:12
 */

// npm publish --tag dev --access public

/**
 * --- clickgo 常用的本地库 ---
 * pkgdl dl clickgo@x.x.x vue@x.x.x jszip@x.x.x monaco-editor@x.x.x
 */

import * as cmd from 'commander';
import * as cp from 'child_process';
import * as path from 'path';
import * as builder from 'electron-builder';
import * as compiler from './compiler.js';

const program = new cmd.Command();

program
    .name('clickgo')
    .description('Compile the source code for ClickGo Application, Control, and Theme into standalone files.')
    .version('1.0.0', '-v, --version');

// --- 下载包 ---
program
    .option('-r, --run <path>', 'test run')
    .option('-n, --native', 'build native')
    .option('-p, --platform <platform>', 'build native', 'win')
    .option('-m, --mirror <mirror>', 'electron download mirror')

    .option('-b, --boot <path>', 'compile boot')

    .option('-g, --clickgo <path>', 'clickgo path')

    .option('-c, --control <path...>', 'compile controls')

    .option('-t, --theme <path>', 'compile theme')

    .option('-a, --app <path>', 'compile application')
    .option('-i, --icon <path>', 'application icon')

    .option('-s, --save <path>', 'save path')
    .action(function() {
        const opts = program.opts();
        if (opts.run) {
            // --- run - 只运行 ---
            const electronPath = path.join(import.meta.url.replace('file:///', ''), '../node_modules/.bin/electron' + (process.platform === 'win32' ? '.cmd' : ''));
            const appPath = path.join(process.cwd(), opts.run);
            const child = cp.spawn(electronPath, [appPath], {
                'stdio': 'inherit',
                'shell': process.platform === 'win32',
            });
            child.on('close', (code) => {
                process.exit(code);
            });
        }
        else if (opts.native) {
            // --- 编译 native ---
            let targets: Map<builder.Platform, Map<builder.Arch, string[]>>;
            switch (opts.platform) {
                case 'win': {
                    targets = builder.Platform.WINDOWS.createTarget();
                    break;
                }
                case 'linux': {
                    targets = builder.Platform.LINUX.createTarget();
                    break;
                }
                default: {
                    targets = builder.Platform.MAC.createTarget();
                }
            }
            builder.build({
                'targets': targets,
                'config': {
                    'electronVersion': '37.4.0',
                    'electronDownload': {
                        'mirror': opts.mirror === 'cn' ? 'https://npmmirror.com/mirrors/electron/' : undefined,
                    },
                },
            }).then((r: string[]) => {
                console.log(`Native build result: ${r.join(', ')}.`);
            }).catch((e) => {
                console.error('Native build failed:', e);
            });
        }
        else if (opts.boot) {
            // --- boot ---
            compiler.boot(opts.boot, opts.clickgo, opts.save).then((r: any) => {
                console.log(`Boot result: ${r}.`);
            }).catch(() => {});
        }
        else if (opts.control) {
            // --- control ---
            compiler.control(opts.control, opts.save).then((r: any) => {
                console.log(`Controls result: ${r}.`);
            }).catch(() => {});
        }
        else if (opts.theme) {
            // --- theme ---
            compiler.theme(opts.theme, opts.save).then((r: any) => {
                console.log(`Theme result: ${r}.`);
            }).catch(() => {});
        }
        else if (opts.app) {
            // --- application ---
            compiler.application(opts.app, opts.icon, opts.save).then((r: any) => {
                console.log(`Application result: ${r}.`);
            }).catch(() => {});
        }
    });

program.parse();
