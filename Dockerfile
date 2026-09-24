FROM oven/bun:1
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json ./
RUN bunx prisma generate
EXPOSE 4000
CMD ["sh", "-c", "bunx prisma migrate deploy && bun src/index.ts"]
