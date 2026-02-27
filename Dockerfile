FROM node:22-alpine

WORKDIR /tool
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN chmod +x bin/echodocs.mjs

WORKDIR /docs
ENTRYPOINT ["/tool/bin/echodocs.mjs"]
CMD ["build"]
