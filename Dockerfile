FROM node:18.13-alpine

RUN mkdir docker_project && cd docker_project
COPY markup/ docker_project/markup
COPY public/ docker_project/public
COPY src/ docker_project/src
COPY .eslintrc.yml docker_project/
COPY package.json docker_project/
COPY requirements.md docker_project/
COPY webpack.config.js docker_project/

RUN cd docker_project && npm install --force && npm run build

# RUN npm install
RUN ls -la /docker_project
RUN ls -la /docker_project/src
WORKDIR /docker_project/public
CMD npm run start
