# ClickGo Compiler

<p align="center">
    <a href="https://github.com/maiyun/clickgo-compiler/blob/master/LICENSE">
        <img alt="License" src="https://img.shields.io/github/license/maiyun/clickgo-compiler?color=blue" />
    </a>
    <a href="https://www.npmjs.com/package/clickgo-compiler">
        <img alt="NPM stable version" src="https://img.shields.io/npm/v/clickgo-compiler?color=brightgreen&logo=npm" />
    </a>
    <a href="https://github.com/maiyun/clickgo-compiler/releases">
        <img alt="GitHub releases" src="https://img.shields.io/github/v/release/maiyun/clickgo-compiler?color=brightgreen&logo=github" />
    </a>
    <a href="https://github.com/maiyun/clickgo-compiler/issues">
        <img alt="GitHub issues" src="https://img.shields.io/github/issues/maiyun/clickgo-compiler?color=blue&logo=github" />
    </a>
</p>

Compile ClickGo applications, themes, controls, and native packages.

## Languages

[简体中文](doc/README.sc.md) | [繁體中文](doc/README.tc.md) | [日本語](doc/README.ja.md) | [한국어](doc/README.ko.md)

## Installation

You can install it directly through the npm command.

```sh
$ npm i clickgo-compiler -g
```

## Usage

After installation, use the command `clickgo` directly in the current directory. For example:

```sh
$ clickgo --app app
```

## Compile Application

Use the `--app` or `-a` parameter to compile a directory into a cga ClickGo application file. For example:

```sh
$ clickgo --app folder
```

You can specify an icon file for the application using the `--icon` or `-i` parameter. For example:

```sh
$ clickgo --app folder --icon icon.png
```

The cga file will be generated in the parent folder of the corresponding folder. In the above example, it will be generated in the parent folder of "folder".

You can specify the save path for the compiled file using the `--save` or `-s` parameter (do not include an extension or a path ending with /). For example:

```sh
$ clickgo --app folder --save app
$ clickgo --app folder --save build/
```

## Compile Theme

Use the `--theme` or `-t` parameter to compile a directory into a cgt ClickGo theme file. For example:

```sh
$ clickgo --theme light
```

The cgt file will be generated in the parent folder of the corresponding folder. In the above example, it will be generated in the parent folder of "light".

You can specify the save path for the compiled file using the `--save` or `-s` parameter (do not include an extension or a path ending with /). For example:

```sh
$ clickgo --theme light --save theme
$ clickgo --theme light --save build/
```

## Compile Control

Use the `--control` or `-c` parameter to compile a directory into a cgc ClickGo control file. For example:

```sh
$ clickgo -c control/button
```

The cgc file will be generated in the parent folder of the corresponding folder. In the above example, it will be generated in the "control" folder.

You can specify the save path for the compiled file using the `--save` or `-s` parameter (do not include an extension or a path ending with /). For example:

```sh
$ clickgo --save common --theme button checkbox
$ clickgo --save build/ --theme button
```

## Compile Native Package

Use the `--native` or `-n` parameter to compile the current directory into a native package. For example:

```sh
$ clickgo --native
```

If you are in mainland China, use the `--mirror` or `-m` parameter to download Electron from a mirror. The option applies to both native packaging and test runs. For example:

```sh
$ clickgo --native --mirror cn
```

### Linux Application Icons

When building with `clickgo --native --platform linux`, a single PNG configured in `build.linux.icon` (or the shared `build.icon`) is automatically resized into standard Linux desktop icon sizes. Use a square PNG of at least 256×256 pixels; 512×512 or 1024×1024 is recommended. For example:

```json
{
    "build": {
        "linux": {
            "icon": "./doc/logo.png"
        }
    }
}
```

Generated icons are temporary and cleaned up after packaging. The source image and project configuration are not changed. Existing icon-set directories remain supported without regeneration. This configures the installed application-list icon, not the native window's runtime icon.

## Run Native Package

Use the `--run` or `-r` parameter to execute the native package without compiling. For example:

```sh
$ clickgo --run ./dist/index
$ clickgo --run ./dist/index --mirror cn
```

The Electron runtime used by `--run` is stored in the current user's cache directory, so a system-wide installation of ClickGo Compiler does not require write access to the global `node_modules` directory.

## License

This library is published under [Apache-2.0](./LICENSE) license.
