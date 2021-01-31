FROM node:14
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN apk --no-cache add curl \
		curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add - \
 	 	apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main" \
 		apt-get update && sudo apt-get install terraform
RUN yarn
RUN yarn build
EXPOSE 3000 5000
CMD [ "npx", "serve", "-s", "build" ]