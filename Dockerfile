FROM node:14-alpine3.15 AS runner
WORKDIR /app
ARG PORT
ENV NODE_ENV production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
# You only need to copy next.config.js if you are NOT using the default configuration
COPY  /next.config.js ./
COPY  /public ./public
COPY  /.next ./.next
COPY  --chown=nextjs:nodejs /.next ./.next
COPY  /node_modules ./node_modules
COPY  /package.json ./package.json
COPY .env .
# Execute script
USER nextjs

EXPOSE ${PORT}
ENV PORT ${PORT}

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1
CMD ["yarn", "start"]
