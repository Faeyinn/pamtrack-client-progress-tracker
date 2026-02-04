# -----------------------
# BUILD STAGE
# -----------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY prisma ./prisma

# Install semua dependencies (dev + prod)
RUN pnpm install --frozen-lockfile

# Copy seluruh source code
COPY . .

# Generate Prisma client
RUN pnpm prisma generate

# Build time arguments
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

# Set env vars for build
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

# Build Next.js app
RUN pnpm build

# Prune development dependencies to prepare for production copy
RUN pnpm prune --prod --ignore-scripts

# -----------------------
# PRODUCTION STAGE
# -----------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install pnpm globally di production image
RUN npm install -g pnpm

# Copy package files (optional, helpful for debugging or scripts)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy node_modules from builder (contains prod deps & generated prisma client)
COPY --from=builder /app/node_modules ./node_modules

COPY prisma ./prisma

# Copy hasil build Next.js
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["pnpm", "start"]
