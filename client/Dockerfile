# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:16.13.1-alpine3.14 as build-stage
WORKDIR /app
# COPY package*.json /app/
COPY ["package.json", "package-lock.json", "tsconfig.json", "nginx.conf", ".env", "./"]
RUN npm install
COPY ./src src
COPY ./public public
RUN npm run build
# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15
COPY --from=build-stage /app/build/ /usr/share/nginx/html
# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80