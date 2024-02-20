# Package Downloader

<p align="center">
    <a href="https://github.com/maiyun/clickgo-compiler/blob/master/LICENSE">
        <img alt="License" src="https://img.shields.io/github/license/maiyun/clickgo-compiler?color=blue" />
    </a>
    <a href="https://www.npmjs.com/package/clickgo-compiler">
        <img alt="NPM stable version" src="https://img.shields.io/npm/v/clickgo-compiler?color=brightgreen&logo=npm" />
        <img alt="NPM development version" src="https://img.shields.io/npm/v/clickgo-compiler/dev?color=yellow&logo=npm" />
    </a><br>
    <a href="https://github.com/maiyun/clickgo-compiler/releases">
        <img alt="GitHub releases" src="https://img.shields.io/github/v/release/maiyun/clickgo-compiler?color=brightgreen&logo=github" />
        <img alt="GitHub pre-releases" src="https://img.shields.io/github/v/release/maiyun/clickgo-compiler?color=yellow&logo=github&include_prereleases" />
    </a>
    <a href="https://github.com/maiyun/clickgo-compiler/issues">
        <img alt="GitHub issues" src="https://img.shields.io/github/issues/maiyun/clickgo-compiler?color=blue&logo=github" />
    </a>
</p>

下载 NPM 包的文件到本地文件夹，保持包内原有的目录结构。如果包含 css 和 js 文件的话则会自动生成一个 min 的压缩版。

## 安装

你可以直接通过 npm 命令进行安装。

```sh
$ npm i clickgo-compiler -g
```

或者安装最新的开发版来体验最新的功能。

```sh
$ npm i clickgo-compiler@dev -g
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

## 编译主题

使用 `--theme` 或 `-t` 参数将某个目录编译为 cgt ClickGo 主题文件，例如：

```sh
$ clickgo --theme theme/light
```

## 编译控件

使用 `--control` 或 `-c` 参数将某个目录编译为 cgc ClickGo 控件文件，例如：

```sh
$ clickgo -c control/button
```

## 生成位置

编译后独立文件将会自动生成在执行命令的目录当中，也可以使用 `--save` 或 `-s` 参数指定保存的目录，例如：

```sh
$ clickgo -c control/button -s controls
```

## 许可

本库使用 [Apache-2.0](../LICENSE) 许可。