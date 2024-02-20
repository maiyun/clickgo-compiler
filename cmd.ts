/**
 * Project: clickgo-compiler, User: JianSuoQiYue
 * Date: 2024-2-20 15:40:13
 */

// npm publish --tag dev --access public

/**
 * --- clickgo 常用的本地库 ---
 * pkgdl dl whatwg-fetch@3.0.0 @litert/loader@3.4.9 clickgo@3.2.6 vue@3.2.47 @juggle/resize-observer@3.4.0 jszip@3.10.0 monaco-editor@0.34.1
 */

import * as cmd from 'commander';
import * as compiler from './compiler';

const program = new cmd.Command();

program
    .name('clickgo')
    .description('Compile the source code for ClickGo Application, Control, and Theme into standalone files.')
    .version('0.0.1', '-v, --version');

// --- 下载包 ---
program
    .option('-c, --control <path...>', 'compile controls')
    .option('-t, --theme <path>', 'compile theme')
    .option('-a, --app <path>', 'compile application')
    .option('-s, --save <path>', 'save path')
    .action(async function() {
        const opts = program.opts();
        if (opts.control) {
            const r = await compiler.control(opts.control, opts.save);
            console.log(`${r} controls compiled successfully.`);
        }
    });

program.parse();
