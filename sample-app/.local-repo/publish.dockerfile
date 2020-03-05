FROM node:12

WORKDIR /app

RUN npm i -g lerna

COPY . .

ENTRYPOINT lerna publish from-package --ignore-scripts --registry http://localhost:4873 --yes
