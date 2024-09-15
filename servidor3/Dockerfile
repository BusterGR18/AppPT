FROM archlinux

# Update package manager and install necessary packages
RUN pacman -Syu --noconfirm && \
    pacman -S --noconfirm yarn nodejs npm 

# Create App Directory
RUN mkdir -p /usr/src/server
WORKDIR /usr/src/server

# Copy only the package.json and yarn.lock (if available) to leverage Docker cache
COPY package-lock.json package.json ./

RUN npm ci

# Copy the rest of the application files
COPY . .

# Open the port for the application
EXPOSE 4000

CMD ["npm","start"]