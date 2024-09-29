FROM node:20-alpine

WORKDIR /payroll-project

COPY package*.json ./
RUN npm install --only=production
COPY . .

ENV PORT=3300
ENV BUILD=production
ENV DATABASE_PATH=/payroll-project/database/payroll.db

RUN npm run db-init

EXPOSE 3300

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN mkdir -p /payroll-project/database && chown -R appuser:appgroup /payroll-project/database
USER appuser

HEALTHCHECK CMD curl --fail http://localhost:3000/status || exit 1

CMD ["node", "app.js"]

