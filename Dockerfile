FROM node:18.19.1
ENV NODE_ENV=development
WORKDIR /opt/
COPY ./package.json ./yarn.lock ./
ENV PATH /opt/node_modules/.bin:$PATH
RUN  yarn install
WORKDIR /opt/app
COPY . .
RUN yarn build
EXPOSE 1337
CMD ["yarn", "develop"]