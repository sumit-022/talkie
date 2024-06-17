FROM node:18-alpine
WORKDIR /app

# Copy only the necessary files to install dependencies
COPY package.json yarn.lock ./
COPY apps/client/package.json ./apps/client/
COPY apps/server/package.json ./apps/server/
COPY prisma ./prisma/

RUN yarn install --frozen-lockfile

COPY apps/server/ ./apps/server/

# Prisma generate
RUN yarn workspace server prisma generate


EXPOSE 4000
CMD ["yarn", "workspace", "server", "dev"]
