FROM node:latest

WORKDIR /comments

ENV REDIS_URI=redis://redis:6379
ENV MONGODB_URI=mongodb://mongodb:27017/comments
ENV RABBITMQ_URI=amqp://guest:guest@rabbitmq:5672

COPY "package*.json" ./

RUN npm ci 

COPY . . 

RUN npm run build

CMD ["npm", "run", "start:prod"]