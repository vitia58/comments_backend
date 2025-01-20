@echo off
setlocal

for %%i in (.) do (
    if /i "%%~nxi"=="install" (
        cd ..
    )
)

IF NOT EXIST ".env" (
    COPY ".env.example" ".env"
    start notepad ".env"
    echo "Please fill in the .env click any key to continue"
    pause
)

if not exist "commentstest\.env" (
    copy ".env" "commentstest\" >nul
)

if not exist "captcha\.env" (
    copy ".env" "captcha\" >nul
)

docker-compose up -d