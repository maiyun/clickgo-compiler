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

ClickGo의 애플리케이션, 테마, 컨트롤, 부트 파일 및 네이티브 패키지를 컴파일합니다.

## 언어

[English](../README.md) | [简体中文](README.sc.md) | [繁體中文](README.tc.md) | [日本語](README.ja.md)

## 설치

npm 명령어를 사용하여 직접 설치할 수 있습니다.

```sh
$ npm i clickgo-compiler -g
```

또는 최신 개발 버전을 설치하여 최신 기능을 체험할 수 있습니다.

```sh
$ npm i clickgo-compiler@dev -g
```

## 사용 방법

설치 후, 현재 디렉토리에서 직접 `clickgo` 명령을 사용하세요. 예를 들어 다음 명령을 실행합니다:

```sh
$ clickgo --app app
```

## 애플리케이션 컴파일

`--app` 또는 `-a` 매개변수를 사용하여 특정 디렉토리를 cga ClickGo 애플리케이션 파일로 컴파일합니다. 예시:

```sh
$ clickgo --app folder
```

`--icon` 또는 `-i` 매개변수를 사용하여 애플리케이션의 아이콘 파일을 지정할 수 있습니다. 예시:

```sh
$ clickgo --app folder --icon icon.png
```

cga 파일은 해당 폴더의 부모 폴더에 생성됩니다. 위 예에서 생성된 파일은 folder의 부모 폴더에 생성됩니다.

`--save` 또는 `-s` 매개변수를 사용하여 컴파일된 파일의 저장 경로를 지정할 수 있습니다(확장자나 /로 끝나는 경로를 사용하지 마세요). 예시:

```sh
$ clickgo --app folder --save app
$ clickgo --app folder --save build/
```

## 테마 컴파일

`--theme` 또는 `-t` 매개변수를 사용하여 특정 디렉토리를 cgt ClickGo 테마 파일로 컴파일합니다. 예시:

```sh
$ clickgo --theme light
```

cgt 파일은 해당 폴더의 부모 폴더에 생성됩니다. 위 예에서 생성된 파일은 light의 부모 폴더에 생성됩니다.

`--save` 또는 `-s` 매개변수를 사용하여 컴파일된 파일의 저장 경로를 지정할 수 있습니다(확장자나 /로 끝나는 경로를 사용하지 마세요). 예시:

```sh
$ clickgo --theme light --save theme
$ clickgo --theme light --save build/
```

## 컨트롤 컴파일

`--control` 또는 `-c` 매개변수를 사용하여 특정 디렉토리를 cgc ClickGo 컨트롤 파일로 컴파일합니다. 예시:

```sh
$ clickgo -c control/button
```

cgc 파일은 해당 폴더의 부모 폴더에 생성됩니다. 위 예에서 생성된 파일은 control 폴더에 생성됩니다.

`--save` 또는 `-s` 매개변수를 사용하여 컴파일된 파일의 저장 경로를 지정할 수 있습니다(확장자나 /로 끝나는 경로를 사용하지 마세요). 예시:

```sh
$ clickgo --save common --theme button checkbox
$ clickgo --save build/ --theme button
```

## 부트 파일 컴파일

`--boot` 또는 `-b` 매개변수를 사용하여 진입점 js 파일(확장자 없음)을 컴파일합니다. 컴파일된 js 진입점 파일은 웹 페이지에서 로드해야 합니다. 예시:

```sh
$ clickgo -b index -g https://cdn.jsdelivr.net/npm/clickgo@4.x.x/dist/index.js
```

## 네이티브 패키지 컴파일

`--native` 또는 `-n` 매개변수를 사용하여 현재 디렉토리를 네이티브 패키지로 컴파일합니다. 예시:

```sh
$ clickgo --native
```

중국 본토에 있는 경우 `--mirror` 또는 `-m` 매개변수를 사용하여 미러를 사용하여 패키징합니다. 예시:

```sh
$ clickgo --native --mirror cn
```

## 네이티브 패키지 실행

`--run` 또는 `-r` 매개변수를 사용하여 컴파일하지 않고 네이티브 패키지를 실행합니다. 예시:

```sh
$ clickgo --run ./dist/index
```

## 라이선스

본 라이브러리는 [Apache-2.0](../LICENSE) 라이선스를 사용합니다.