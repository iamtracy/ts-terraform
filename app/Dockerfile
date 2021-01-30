FROM node:current-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN yarn
RUN yarn build
EXPOSE 3000 5000
CMD [ "npx", "serve", "-s", "build" ]