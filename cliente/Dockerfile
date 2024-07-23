FROM archlinux

# Update package manager and install necessary packages
RUN pacman -Syu --noconfirm && \
    pacman -S --noconfirm yarn nodejs npm nginx

# Set working directory
WORKDIR /app

# Copy only the package.json and yarn.lock (if available) to leverage Docker cache
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application files
COPY . .

# Build and optimize static files
RUN yarn build

# Copy the built static files to the Nginx folder to serve static content
RUN cp -r /app/build/* /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Open the port for the application
EXPOSE 80

# Run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
    