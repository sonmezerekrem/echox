FROM node:22-alpine

WORKDIR /tool
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN chmod +x bin/echox.mjs

WORKDIR /docs
ENTRYPOINT ["/tool/bin/echox.mjs"]
CMD ["build"]
