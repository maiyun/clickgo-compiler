# ClickGo Compiler

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

ClickGo のアプリケーション、テーマ、コントロール、ブートファイル、ネイティブパッケージをコンパイルします。

## 言語

[English](../README.md) | [简体中文](README.sc.md) | [繁體中文](README.tc.md) | [한국어](README.ko.md)

## インストール

npm コマンドを使用して直接インストールできます。

```sh
$ npm i clickgo-compiler -g
```

または最新の開発版をインストールして、最新の機能を体験できます。

```sh
$ npm i clickgo-compiler@dev -g
```

## 使用方法

インストール後、現在のディレクトリで直接 `clickgo` コマンドを使用します。例えば、次のコマンドを実行します：

```sh
$ clickgo --app app
```

## アプリケーションのコンパイル

`--app` または `-a` パラメータを使用して、特定のディレクトリを cga ClickGo アプリケーションファイルにコンパイルします。例：

```sh
$ clickgo --app folder
```

`--icon` または `-i` パラメータを使用して、アプリケーションのアイコンファイルを指定できます。例：

```sh
$ clickgo --app folder --icon icon.png
```

cga ファイルは対応するフォルダの親フォルダに生成されます。上記の例では、folder の親フォルダに生成されます。

`--save` または `-s` パラメータを使用して、コンパイル後のファイルの保存先パスを指定できます（拡張子やスラッシュで終わるパスは使用しないでください）。例：

```sh
$ clickgo --app folder --save app
$ clickgo --app folder --save build/
```

## テーマのコンパイル

`--theme` または `-t` パラメータを使用して、特定のディレクトリを cgt ClickGo テーマファイルにコンパイルします。例：

```sh
$ clickgo --theme light
```

cgt ファイルは対応するフォルダの親フォルダに生成されます。上記の例では、light の親フォルダに生成されます。

`--save` または `-s` パラメータを使用して、コンパイル後のファイルの保存先パスを指定できます（拡張子やスラッシュで終わるパスは使用しないでください）。例：

```sh
$ clickgo --theme light --save theme
$ clickgo --theme light --save build/
```

## コントロールのコンパイル

`--control` または `-c` パラメータを使用して、特定のディレクトリを cgc ClickGo コントロールファイルにコンパイルします。例：

```sh
$ clickgo -c control/button
```

cgc ファイルは対応するフォルダの親フォルダに生成されます。上記の例では、control フォルダに生成されます。

`--save` または `-s` パラメータを使用して、コンパイル後のファイルの保存先パスを指定できます（拡張子やスラッシュで終わるパスは使用しないでください）。例：

```sh
$ clickgo --save common --theme button checkbox
$ clickgo --save build/ --theme button
```

## ブートファイルのコンパイル

`--boot` または `-b` パラメータを使用して、エントリ js ファイル（拡張子なし）をコンパイルします。コンパイル後の js エントリファイルは、Web ページで読み込む必要があります。例：

```sh
$ clickgo -b index -g https://cdn.jsdelivr.net/npm/clickgo@4.x.x/dist/index.js
```

## ネイティブパッケージのコンパイル

`--native` または `-n` パラメータを使用して、現在のディレクトリをネイティブパッケージにコンパイルします。例：

```sh
$ clickgo --native
```

中国本土にいる場合は、`--mirror` または `-m` パラメータを使用してミラーを使用してパッケージ化します。例：

```sh
$ clickgo --native --mirror cn
```

## ネイティブパッケージの実行

`--run` または `-r` パラメータを使用して、コンパイルせずにネイティブパッケージを実行します。例：

```sh
$ clickgo --run ./dist/index
```

## ライセンス

このライブラリは [Apache-2.0](../LICENSE) ライセンスで提供されています。