FROM node:current-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add - \
 		sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main" \
 		sudo apt-get update && sudo apt-get install terraform \
		yarn \
		yarn build
EXPOSE 3000 5000
CMD [ "npx", "serve", "-s", "build" ]