#/bin/bash

if [ ! -f commentstest/.env ]; then
    ln .env commentstest/
fi

if [ ! -f captcha/.env ]; then
    ln .env captcha/
fi