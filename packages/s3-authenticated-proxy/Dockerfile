FROM node:16

WORKDIR /app

COPY . /app/
RUN yarn install

EXPOSE 80

ENTRYPOINT ["yarn", "start"]
