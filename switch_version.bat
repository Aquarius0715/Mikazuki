@echo off

chcp 65001 >nul

:: フェッチとプルを行いながらブランチをトグルするスクリプト

:: トグル対象のブランチを指定
set BRANCH1=normal-season-version
set BRANCH2=busy-season-version

:: Gitリポジトリであることを確認
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo 現在のディレクトリはGitリポジトリではありません。
    echo 終了するには何かを押してください...
    pause >nul
    exit /b 1
)

:: リモートリポジトリから最新の情報をフェッチ
echo リモートリポジトリから最新情報を取得中...
git fetch --all
if errorlevel 1 (
    echo フェッチに失敗しました。
    echo 終了するには何かを押してください...
    pause >nul
    exit /b 1
)

:: 現在のブランチを取得
for /f "delims=" %%i in ('git rev-parse --abbrev-ref HEAD') do set CURRENT_BRANCH=%%i

:: 現在のブランチに応じて切り替えとプルを行う
if "%CURRENT_BRANCH%"=="%BRANCH1%" (
    echo 現在のブランチは ^"%CURRENT_BRANCH%^" です。^"%BRANCH2%^" に切り替えます...
    git checkout %BRANCH2%
    if errorlevel 1 (
        echo ブランチの切り替えに失敗しました。
        echo 終了するには何かを押してください...
        pause >nul
        exit /b 1
    )
    echo ^"%BRANCH2%^" の最新の変更を取得中...
    git pull
    if errorlevel 1 (
        echo プルに失敗しました。
        echo 終了するには何かを押してください...
        pause >nul
        exit /b 1
    )
    echo ブランチ ^"%BRANCH2%^" に切り替え、最新の変更を取得しました。
    echo 終了するには何かを押してください...
    pause >nul
    exit /b 0
)

if "%CURRENT_BRANCH%"=="%BRANCH2%" (
    echo 現在のブランチは ^"%CURRENT_BRANCH%^" です。^"%BRANCH1%^" に切り替えます...
    git checkout %BRANCH1%
    if errorlevel 1 (
        echo ブランチの切り替えに失敗しました。
        echo 終了するには何かを押してください...
        pause >nul
        exit /b 1
    )
    echo ^"%BRANCH1%^" の最新の変更を取得中...
    git pull
    if errorlevel 1 (
        echo プルに失敗しました。
        echo 終了するには何かを押してください...
        pause >nul
        exit /b 1
    )
    echo ブランチ ^"%BRANCH1%^" に切り替え、最新の変更を取得しました。
    echo 終了するには何かを押してください...
    pause >nul
    exit /b 0
)

:: トグル対象外のブランチの場合
echo 現在のブランチはトグル対象外の ^"%CURRENT_BRANCH%^" です。
echo トグル対象のブランチは ^"%BRANCH1%^" または ^"%BRANCH2%^" です。

echo 終了するには何かを押してください...
pause >nul
exit /b 1
