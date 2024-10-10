FROM node:20-alpine as build-deps
WORKDIR /app
COPY . .
ENV NODE_OPTIONS=--max_old_space_size=1024
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=build-deps /app/build /usr/share/nginx/html
#EXPOSE 80
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
