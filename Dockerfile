FROM node as devlopment
WORKDIR /app/api
COPY *.json .
RUN npm install
COPY . .
RUN npm run build

FROM node as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app/api
COPY --from=devlopment ./app/api/package*.json .
RUN npm ci --only=production
COPY --from=devlopment ./app/api/build ./build
CMD ["node","./build/index.js"]