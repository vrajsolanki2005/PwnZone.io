FROM node:20-alpine

# Install nmap
RUN apk add --no-cache nmap nmap-scripts python3 py3-pip git \
    && git clone --depth=1 https://github.com/maurosoria/dirsearch.git /opt/dirsearch \
    && pip3 install --break-system-packages -r /opt/dirsearch/requirements.txt

# Copy pre-downloaded RustScan binary
COPY rustscan /usr/local/bin/rustscan
RUN chmod +x /usr/local/bin/rustscan

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
