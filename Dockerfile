FROM jaydobariya/fanstasy-node-phantom-16:latest
WORKDIR /app
COPY package* /app/
COPY . /app
ENV OPENSSL_CONF=/dev/null
ENV NODE_ENV=production
RUN npm ci --production --legacy-peer-deps
RUN npm i -f @swc/cli @swc/core
RUN pm2 install pm2-metrics
RUN npm run build
EXPOSE 1449
EXPOSE 9209
CMD ["pm2-runtime", "start", "dist/server.js"]
