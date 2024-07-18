FROM node:18-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps
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
ENV NODE_ENV=production
ARG VERSION=
ARG REVISION=
ARG BUILDTIME=
ENV NEXT_PUBLIC_APP_INFO="Version: ${VERSION}, Build: ${BUILDTIME}, Commit: ${REVISION}"
ENV NEXT_PUBLIC_VERSION=${VERSION}

RUN yarn build

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy all files from builder stage
COPY --from=builder /app ./

USER nextjs
EXPOSE 3000

ENV PORT=3000

# Start the Next.js application
CMD ["yarn", "start"]
