# Build Stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
# We can't run npm install easily due to network/env restrictions in some envs, 
# but assuming standard docker build allows it.
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
