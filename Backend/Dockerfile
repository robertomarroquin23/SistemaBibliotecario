FROM node:latest

WORKDIR /SistemaBibliotecario
COPY package*.json ./
COPY . .
EXPOSE 3000

RUN npm install
CMD ["npm","start"]