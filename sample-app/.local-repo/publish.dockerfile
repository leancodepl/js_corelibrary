FROM node:12-stretch

RUN apt-get update && apt-get -y install git expect-dev

RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
    rm /var/log/lastlog /var/log/faillog

RUN npm i -g lerna

WORKDIR /app

COPY . .

ENTRYPOINT ./sample-app/.local-repo/save-token.sh && \
    lerna publish from-package --ignore-scripts --registry ${NPM_REGISTRY} --yes
