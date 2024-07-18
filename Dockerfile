FROM node:18-alpine AS base
 
# 1. Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* ./
RUN yarn --frozen-lockfile

# Install Prisma CLI globally
RUN yarn global add prisma

# Generate Prisma Client
COPY prisma ./prisma
RUN yarn prisma generate
# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# This will do the trick, use the corresponding env file for each environment.
# COPY .env.production.sample .env.production
ENV NODE_ENV=production
ARG VERSION=
ARG REVISION= 
ARG BUILDTIME=
ENV NEXT_PUBLIC_APP_INFO="Version: ${VERSION}, Build: ${BUILDTIME}, Commit: ${REVISION}"
ENV NEXT_PUBLIC_VERSION=${VERSION}

RUN yarn build

# Run Prisma migrate to update the database schema
# RUN yarn prisma migrate deploy

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

ENV PORT 3000

CMD HOSTNAME=0.0.0.0 node server.js