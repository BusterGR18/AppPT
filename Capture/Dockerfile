# Use an official Arch Linux base image
FROM archlinux

# Update package manager and install necessary packages
RUN pacman -Syu --noconfirm && \
    pacman -S --noconfirm nodejs npm

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Command to run the application
CMD ["node", "NewLogger.js"]
