# Use the official Node image
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose the port React/Vite runs on (usually 5173 for Vite or 3000 for CRA)
EXPOSE 5173

# Command to start the frontend dev server
CMD ["npm", "run", "dev", "--", "--host"]