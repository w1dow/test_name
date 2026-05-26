FROM node:18

# create app directory
WORKDIR /app

# copy package files
COPY package*.json ./

# install dependencies
RUN npm install

# copy all source code
COPY . .

# expose port
EXPOSE 3000

# start server
CMD ["node", "src/server.js"]