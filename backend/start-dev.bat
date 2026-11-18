@echo off
setlocal

cd /d "%~dp0"

if not exist ".venv\Scripts\python.exe" (
    echo Criando ambiente virtual...
    py -m venv .venv
    if errorlevel 1 goto :error
)

echo Conferindo dependencias do projeto...
".venv\Scripts\python.exe" -m pip install -e ".[dev]"
if errorlevel 1 goto :error

echo API: http://127.0.0.1:8000/docs
echo Site: http://127.0.0.1:8000/site/index.html
echo Pressione CTRL+C para parar o servidor.
echo.

".venv\Scripts\python.exe" -m uvicorn app.main:app --reload
exit /b %errorlevel%

:error
echo Falha ao preparar ou iniciar o backend. Confira a mensagem acima.
pause
exit /b 1
