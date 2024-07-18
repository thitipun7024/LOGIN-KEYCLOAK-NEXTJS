FROM node:18-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json yarn.lock* ./
RUN yarn --frozen-lockfile

RUN yarn global add prisma

COPY prisma ./prisma
RUN yarn prisma generate

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
ARG VERSION=
ARG REVISION=
ARG BUILDTIME=
ENV NEXT_PUBLIC_APP_INFO="Version: ${VERSION}, Build: ${BUILDTIME}, Commit: ${REVISION}"
ENV NEXT_PUBLIC_VERSION=${VERSION}

RUN yarn build

FROM base AS runner
WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# คัดลอกไฟล์ที่สร้างจาก builder stage มายัง runner stage
COPY --from=builder /app ./

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
