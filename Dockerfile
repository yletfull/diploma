# Stage 1: Build Stage
# Use the official Node.js image based on Alpine for a smaller image size
FROM node:14-alpine AS build

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install --production=false

# Copy the rest of the application code
COPY . .

# Stage 2: Production Stage
# Use a smaller Node.js image for production
FROM node:14-alpine

# Set working directory inside the container
WORKDIR /app

# Copy only necessary files from the build stage
COPY --from=build /app .

# Install production dependencies
RUN npm install --only=production

# Expose port 3000 (or other if your app uses a different port)
EXPOSE 3000

# Command to run the application
CMD ["node", "server.js"]
