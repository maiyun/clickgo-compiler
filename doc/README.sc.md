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

编译 ClickGo 的应用、主题、控件、启动文件和 native 包。

## 语言

[English](../README.md) | [繁體中文](README.tc.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

## 安装

你可以直接通过 npm 命令进行安装。

```sh
$ npm i clickgo-compiler -g
```

## 使用

安装后，直接在当前目录使用命令 `clickgo` 即可，例如执行以下命令：

```sh
$ clickgo --app app
```

## 编译应用

使用 `--app` 或 `-a` 参数将某个目录编译为 cga ClickGo 应用文件，例如：

```sh
$ clickgo --app folder
```

携带 `--icon` 或 `-i` 参数可以指定应用的图标文件，例如：

```sh
$ clickgo --app folder --icon icon.png
```

cga 文件会生成在对应文件夹的父文件夹下，如上述例子会生成在 folder 的父文件夹下。

携带 `--save` 或 `-s` 参数可以指定编译后的文件保存的路径（不要带扩展名或以 / 结尾的路径），例如：

```sh
$ clickgo --app folder --save app
$ clickgo --app folder --save build/
```

## 编译主题

使用 `--theme` 或 `-t` 参数将某个目录编译为 cgt ClickGo 主题文件，例如：

```sh
$ clickgo --theme light
```

cgt 文件会生成在对应文件夹的父文件夹下，如上述例子会生成在 light 的父文件夹下。

携带 `--save` 或 `-s` 参数可以指定编译后的文件保存的路径（不要带扩展名或以 / 结尾的路径），例如：

```sh
$ clickgo --theme light --save theme
$ clickgo --theme light --save build/
```

## 编译控件

使用 `--control` 或 `-c` 参数将某个目录编译为 cgc ClickGo 控件文件，例如：

```sh
$ clickgo -c control/button
```

cgc 文件会生成在对应文件夹的父文件夹下，如上述例子会生成在 control 文件夹下。

携带 `--save` 或 `-s` 参数可以指定编译后的文件保存的路径（不要带扩展名或以 / 结尾的路径），例如：

```sh
$ clickgo --save common --theme button checkbox
$ clickgo --save build/ --theme button
```

## 编译启动文件

使用 `--boot` 或 `-b` 参数将某个入口 js 文件（不含扩展名）进行编译，网页上要加载编译后的 js 入口文件，例如：

```sh
$ clickgo -b index -g https://cdn.jsdelivr.net/npm/clickgo@4.x.x/dist/index.js
```

## 编译 native 包

使用 `--native` 或 `-n` 参数将当前目录编译为 native 包，例如：

```sh
$ clickgo --native
```

如果你在中国大陆，请使用 `--mirror` 或 `-m` 参数使用镜像进行打包，例如：

```sh
$ clickgo --native --mirror cn
```

## 执行 native 包

使用 `--run` 或 `-r` 参数在不编译的情况下执行 native 包，例如：

```sh
$ clickgo --run ./dist/index
```

## 许可

本库使用 [Apache-2.0](../LICENSE) 许可。