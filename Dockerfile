FROM node:latest

EXPOSE 3000

RUN npm install nodemon -g

# Comment out the lines bellow if you want to run inside the docker ( after comment out, run the command: "docker image build -t node-auth-api .")
ADD . /src
WORKDIR /src


# Uncomment the lines bellow if you want to run inside the docker, but the hot reload will not work and you should compile
#the image always ( after uncomment, run the command: "docker image build -t node-auth-api .")
#
#RUN mkdir /usr/src/node-auth
#
#WORKDIR /usr/src/node-auth
#
#COPY . .
#
#RUN npm install
RUN npm cache verify

CMD ["npm","start"]