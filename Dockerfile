FROM node:14
WORKDIR /usr/src/app

COPY ["package*.json", "yarn.lock", "./"]
RUN yarn install
COPY . .
RUN ["yarn", "run", "heroku-postbuild"]

CMD ["yarn", "run", "start"]
