# Build stage.
FROM node:24-alpine AS build

WORKDIR /app

# .npmrc carries the supply-chain settings (7-day release quarantine and
# ignore-scripts), so it has to land before anything is installed.
COPY package.json package-lock.json .npmrc ./

# npm ci installs exactly the locked tree and fails if the lockfile has drifted
# from package.json.
RUN npm ci

COPY . .

RUN npm run build

# Runtime stage. The output is a static bundle, so it needs a web server and
# not the Node toolchain that produced it.
FROM nginx:alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 3000
