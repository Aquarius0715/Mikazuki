@echo off
setlocal

rem ===== 設定 =====
set "PORT=8000"
rem 引数でポート上書き（例: serve.bat 8080）
if not "%~1"=="" set "PORT=%~1"

rem このバッチが置かれているフォルダをドキュメントルートに
cd /d "%~dp0"

rem Python ランチャー優先（py → python の順で探す）
where py >nul 2>nul
if %errorlevel%==0 (
  set "PYCMD=py"
) else (
  where python >nul 2>nul
  if %errorlevel%==0 (
    set "PYCMD=python"
  ) else (
    echo [ERROR] Python が見つかりません。https://www.python.org/downloads/ からインストールしてください。
    pause
    exit /b 1
  )
)

echo.
echo Serving "%cd%" on http://127.0.0.1:%PORT%/
echo ※ 初回はファイアウォールの確認ダイアログが出たら [許可] を選択してください。
echo 終了するには [Ctrl] + [C] を押します。
echo.

rem ブラウザを自動で開く（2秒待ってから）
start "" /b cmd /c "timeout /t 2 >nul & start "" "http://127.0.0.1:%PORT%/""

rem サーバ起動（127.0.0.1 のみにバインド）
"%PYCMD%" -m http.server %PORT% --bind 127.0.0.1

echo.
echo サーバーを停止しました。
pause
