# Specify the base image
FROM node:20

# Set the working directory
WORKDIR /

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start your app
CMD [ "npm", "run", "dev" ]
