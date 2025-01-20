#/bin/bash

if [[ "$(basename "$PWD")" == "install" ]]; then
    cd ..
fi

if [ ! -f .env ]; then
    cp .env.example .env
    nano .env
fi

if [ ! -f commentstest/.env ]; then
    ln .env commentstest/
fi

if [ ! -f captcha/.env ]; then
    ln .env captcha/
fi

sudo docker-compose up -d