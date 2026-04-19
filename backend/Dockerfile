# Use Node.js 20 alpine as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Cloud Run sets the PORT environment variable to 8080 by default.
# Our server.js uses process.env.PORT || 4000, so this will work.
EXPOSE 8080
ENV PORT 8080

# Start the application
CMD ["npm", "start"]
