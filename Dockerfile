# # Use Node image
# FROM node:20

# # Set working directory
# WORKDIR /app

# # Copy package files
# COPY package.json package-lock.json ./

# # Install dependencies
# RUN npm install

# # Copy all project files
# COPY . .

# # Expose port (Vite default)
# EXPOSE 5173

# # Run dev server
# CMD ["npm", "run", "dev"]

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/build ./build

EXPOSE 8080

CMD ["sh", "-c", "serve -s build -l ${PORT:-8080}"]
