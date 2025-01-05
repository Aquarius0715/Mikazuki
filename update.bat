@echo off

chcp 65001 >nul

:: 2つのブランチをプルし、それぞれの最新状態を維持するスクリプト

:: トグル対象のブランチを指定
set BRANCH1=normal-season-version
set BRANCH2=busy-season-version

:: Gitリポジトリであることを確認
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo 現在のディレクトリはGitリポジトリではありません。
    echo 何かを押してください...
    pause
    exit /b 1
)

:: リモートリポジトリから最新の情報をフェッチ
echo リモートリポジトリから最新情報を取得中...
git fetch --all
if errorlevel 1 (
    echo フェッチに失敗しました。
    echo 何かを押してください...
    pause
    exit /b 1
)

:: 現在のブランチを取得
for /f "delims=" %%i in ('git rev-parse --abbrev-ref HEAD') do set CURRENT_BRANCH=%%i

:: BRANCH1 をプル
if not "%CURRENT_BRANCH%"=="%BRANCH1%" (
    echo "%BRANCH1%" に切り替えています...
    git checkout %BRANCH1%
    if errorlevel 1 (
        echo "%BRANCH1%" への切り替えに失敗しました。
        echo 何かを押してください...
        pause
        exit /b 1
    )
)
echo "%BRANCH1%" の最新の変更を取得中...
git pull
if errorlevel 1 (
    echo "%BRANCH1%" のプルに失敗しました。
    echo 何かを押してください...
    pause
    exit /b 1
)

:: BRANCH2 をプル
echo "%BRANCH2%" に切り替えています...
git checkout %BRANCH2%
if errorlevel 1 (
    echo "%BRANCH2%" への切り替えに失敗しました。
    echo 何かを押してください...
    pause
    exit /b 1
)
echo "%BRANCH2%" の最新の変更を取得中...
git pull
if errorlevel 1 (
    echo "%BRANCH2%" のプルに失敗しました。
    echo 何かを押してください...
    pause
    exit /b 1
)

:: 元のブランチに戻す
if not "%CURRENT_BRANCH%"=="%BRANCH1%" if not "%CURRENT_BRANCH%"=="%BRANCH2%" (
    echo 元のブランチ "%CURRENT_BRANCH%" に戻ります...
    git checkout %CURRENT_BRANCH%
    if errorlevel 1 (
        echo 元のブランチへの切り替えに失敗しました。
        echo 何かを押してください...
        pause
        exit /b 1
    )
)

echo 両方のブランチをプルしました。
echo 何かを押してください...
pause
exit /b 0
