FROM node:16.13.0-bullseye-slim
WORKDIR /srv/app
COPY ./package.json ./package.json
RUN  npm install -g npm && npm install

COPY ./  /srv/app
RUN cd src &  npm run build
ENTRYPOINT ["npm", "run", "preview"] 
CMD ["--", "--host"]