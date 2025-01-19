FROM node:latest

WORKDIR /comments

ENV MONGODB_URI=mongodb://mongodb:27017/comments
ENV RABBITMQ_URI=amqp://rabbitmq:5672

COPY "package*.json" . 

RUN npm ci 

COPY . . 

RUN npm run build

CMD ["npm", "run", "start:prod"]