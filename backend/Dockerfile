ARG NODE_VERSION=22-alpine

# =========================================================
# Dependencies
# =========================================================
FROM node:${NODE_VERSION} AS deps

WORKDIR /app

COPY package*.json ./

RUN if [ -f package-lock.json ]; then \
      npm ci --omit=dev; \
    else \
      npm install --omit=dev; \
    fi


# =========================================================
# Runtime
# =========================================================
FROM node:${NODE_VERSION} AS runtime

ENV NODE_ENV=production

WORKDIR /app

# ---------------------------------------------------------
# Create non-root user
# ---------------------------------------------------------
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup

# ---------------------------------------------------------
# Copy dependencies
# ---------------------------------------------------------
COPY --from=deps /app/node_modules ./node_modules

# ---------------------------------------------------------
# Copy application
# ---------------------------------------------------------
COPY . .

# ---------------------------------------------------------
# Create upload directories
# ---------------------------------------------------------
RUN mkdir -p \
      /app/uploads/images \
      /app/uploads/documents \
      /app/uploads/media

# ---------------------------------------------------------
# Copy entrypoint
# ---------------------------------------------------------
COPY entrypoint.sh /app/entrypoint.sh

# ---------------------------------------------------------
# Set permissions
# ---------------------------------------------------------
RUN chmod 755 /app/entrypoint.sh && \
    chown -R appuser:appgroup /app/uploads && \
    chown appuser:appgroup /app/entrypoint.sh

# ---------------------------------------------------------
# Run as non-root user
# ---------------------------------------------------------
USER appuser

EXPOSE 5000

ENTRYPOINT ["/app/entrypoint.sh"]