FROM node:latest

WORKDIR /captcha

ENV REDIS_URI=redis://redis:6379
ENV RABBITMQ_URI=amqp://rabbitmq:5672

COPY "package*.json" . 

RUN npm ci 

COPY . . 

RUN npm run build

CMD ["npm", "run", "start:prod"]