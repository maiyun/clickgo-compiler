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

編譯 ClickGo 的應用、主題、控件、啟動文件和 native 包。

## 語言

[English](../README.md) | [简体中文](README.sc.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

## 安裝

你可以直接透過 npm 命令進行安裝。

```sh
$ npm i clickgo-compiler -g
```

## 使用

安裝後，直接在當前目錄使用命令 `clickgo` 即可，例如執行以下命令：

```sh
$ clickgo --app app
```

## 編譯應用

使用 `--app` 或 `-a` 參數將某個目錄編譯為 cga ClickGo 應用文件，例如：

```sh
$ clickgo --app folder
```

攜帶 `--icon` 或 `-i` 參數可以指定應用的圖標文件，例如：

```sh
$ clickgo --app folder --icon icon.png
```

cga 文件會生成在對應文件夾的父文件夾下，如上述例子會生成在 folder 的父文件夾下。

攜帶 `--save` 或 `-s` 參數可以指定編譯後的文件保存的路徑（不要帶擴展名或以 / 結尾的路徑），例如：

```sh
$ clickgo --app folder --save app
$ clickgo --app folder --save build/
```

## 編譯主題

使用 `--theme` 或 `-t` 參數將某個目錄編譯為 cgt ClickGo 主題文件，例如：

```sh
$ clickgo --theme light
```

cgt 文件會生成在對應文件夾的父文件夾下，如上述例子會生成在 light 的父文件夾下。

攜帶 `--save` 或 `-s` 參數可以指定編譯後的文件保存的路徑（不要帶擴展名或以 / 結尾的路徑），例如：

```sh
$ clickgo --theme light --save theme
$ clickgo --theme light --save build/
```

## 編譯控件

使用 `--control` 或 `-c` 參數將某個目錄編譯為 cgc ClickGo 控件文件，例如：

```sh
$ clickgo -c control/button
```

cgc 文件會生成在對應文件夾的父文件夾下，如上述例子會生成在 control 文件夾下。

攜帶 `--save` 或 `-s` 參數可以指定編譯後的文件保存的路徑（不要帶擴展名或以 / 結尾的路徑），例如：

```sh
$ clickgo --save common --theme button checkbox
$ clickgo --save build/ --theme button
```

## 編譯啟動文件

使用 `--boot` 或 `-b` 參數將某個入口 js 文件（不含擴展名）進行編譯，網頁上要加載編譯後的 js 入口文件，例如：

```sh
$ clickgo -b index -g https://cdn.jsdelivr.net/npm/clickgo@4.x.x/dist/index.js
```

## 編譯 native 包

使用 `--native` 或 `-n` 參數將當前目錄編譯為 native 包，例如：

```sh
$ clickgo --native
```

如果你在中國大陸，請使用 `--mirror` 或 `-m` 參數使用鏡像進行打包，例如：

```sh
$ clickgo --native --mirror cn
```

## 執行 native 包

使用 `--run` 或 `-r` 參數在不編譯的情況下執行 native 包，例如：

```sh
$ clickgo --run ./dist/index
```

## 許可

本庫使用 [Apache-2.0](../LICENSE) 許可。