# ✅ Official image with Chromium/Firefox/WebKit + deps preinstalled
FROM mcr.microsoft.com/playwright:v1.56.0-jammy

# Use non-root user that Playwright image provides
USER pwuser
WORKDIR /app

# Create result dirs with open perms (copied into named volumes on first run)
RUN mkdir -p /app/allure-results /app/playwright-report \
 && chmod -R 777 /app/allure-results /app/playwright-report
# Install deps first for layer caching
COPY --chown=pwuser:pwuser package*.json ./
RUN npm ci

# Copy the rest of the project
COPY --chown=pwuser:pwuser . .

# CI-friendly
ENV CI=true

# Default test command (overridden in docker-compose if needed)
CMD ["npx", "playwright", "test"]
