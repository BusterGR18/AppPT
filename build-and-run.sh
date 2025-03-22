#!/bin/bash

# Step 1: Detect IP properly across Arch, Ubuntu, MacOS, etc.
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # This will work on Arch, Ubuntu, CentOS, etc.
    IP=$(ip route get 1.1.1.1 | awk '{print $7; exit}')
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # MacOS alternative
    IP=$(ipconfig getifaddr en0)
else
    echo "Unsupported OS. Please configure IP manually."
    exit 1
fi

if [ -z "$IP" ]; then
    echo "Could not detect IP. Please check your network."
    exit 1
fi

echo "Detected IP: $IP"

# Step 2: Inject it into .env.production
sed -i.bak "s|^REACT_APP_API_URL=.*|REACT_APP_API_URL=http://$IP:4000|" ./cliente/.env.production

echo ".env.production now points to:"
cat ./cliente/.env.production

# Step 3: Spin up your Docker Compose
docker-compose up --build
