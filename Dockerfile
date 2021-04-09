FROM node:12

WORKDIR /opt/kendra

#copy package.json file
COPY package.json /opt/kendra

#install node packges
RUN npm install

#copy all files 
COPY . /opt/kendra

#expose the application port
EXPOSE 4202

#start the application
CMD node app.js