# Hacoryoshka

## Concept

The basic concept is to easily manage front servers, backend servers, and GPU compute nodes for distributed on-premises servers and machine learning nodes in a global network, internal management, and access management.

## End points

- [Back-end(document/rest) http://localhost:3050/](http://localhost:3050/)
- [Front-end http://localhost:4050/](http://localhost:4050/)

## Software stack

Farm is also faster framework instead of NextJS, but source map issue is critical glitch.
Being fast is good, but being able to debug stably is even more important. Therefore, we recommend using Vite as your main framework, as it offers both speed and stability to a certain extent.

| Front-end | Development         | Product       |
| :-------- | :------------------ | :------------ |
| Server    | Vite(SWC)/Farm(alt) | NGINX(Static) |

The bun package is faster development runtime, but its still unstable.
A communication of Vite proxy and bun has buffer controlling bug.

| Back-end | Development                     | Product                         |
| :------- | :------------------------------ | :------------------------------ |
| Server   | Express(swc-node)               | NGINX(:443/) → Express(:3050/)  |
| Reload   | VSCode/nodemon/live-reload      | -                               |
| Database | Prisma(MySQL/PostgreSQL/SQLite) | Prisma(MySQL/PostgreSQL/SQLite) |
| Session  | Redis/Memcached/MemoryStore     | Redis/Memcached/MemoryStore     |

The computing node is always isolated as binary. Available platforms are linux and macos.
Unfortunately, windows platform is still required VM or WSL.

| Node   | Development         | Product                     |
| :----- | :------------------ | :-------------------------- |
| Client | NodeJS16(swc-node)  | tsc → NodeJS → pkg → Binary |
| Proxy  | Not implemented yet | Not implemented yet         |

### Supported OS

| OS      |   Arch    | Support |
| :------ | :-------: | :-----: |
| Linux   | x64/arm64 |    ✔    |
| Linux   | x86/arm7- |         |
| MacOS   |   arm64   |    ✔    |
| MacOS   |  x64/x86  |         |
| Windows |    Any    |         |

### Supported accelarators

| HW                          | Support | Desc                                              |
| :-------------------------- | :-----: | :------------------------------------------------ |
| GeForce/Quadro/Tesla        |    ✔    | Based on nvidia container plugins.                |
| Radeon/W/MI Instinct        |    ✔    | Restricted by ROCm driver version. Required Vega+ |
| Jetson ( Orin/Xavier/Nano ) |    ✔    | Depends on each versions. |
| TPU ( Coral )               |    △    | WIP                                               |
| iGPU ( AMD/Intel )          |         |                                                   |
| Metal ( Apple Sericon )     |         |                                                   |

<br/>
<br/>

## Configuration

```bash
sudo mkdir -p /etc/${app_name}
cp template.config.json /etc/${app_name}/config.json
```

1. <font color='red'>Copy template.config.json to ~/.${app_name}/config.json and setup.</font>
2. <font color='red'>Start front-end and back-end server and setup root user.</font>
3. Create an entry point of compute node and issue an API key. After that setup config on compute node.

#### Back-end configuration

```json
${backend.config.json}
```

#### Compute node configuration

```json
${compute_node.config.json}
```

<br>
<br>

## Installation and Run

Nodejs 16+ based on nvm.
Ubuntu18- version, there is libc package issue. NodeJS18 requires glibc 2.28, and it has to downgrade the package version when you used older linux OS. In particular, some edge devices often restricted by vendor like NVIDIA and Google.

```bash

# Linux/MacOS
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
nvm install 16

node -v

```

For back-end

```bash
##################################################
# In development
cd backend && npm ci
rm -rf ~/.pm2 # delete cache
npm install -g ts-node swc-node nodemon pm2 # execute with sudo in linux.

# Setup your config.json

##################################################
# Initialize database
npm run init

# debug or launch from vscode with launch.json
npm run debug

##################################################
# In product
npm start # build + run on dist

```

The end point will be <a href='http://localhost:3050'>http://localhost:3050</a>

In deployment, "pm2 startup" is useful to prevent reboot of host.

```bash
AMD5950X-4090:back$ pm2 startup
[PM2] Init System found: systemd
[PM2] To setup the Startup Script, copy/paste the following command:
sudo env PATH=$PATH:/usr/local/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u johndoe --hp /home/johndoe

AMD5950X-4090:back$ sudo env PATH=$PATH:/usr/local/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u johndoe --hp /home/johndoe

# after that, pm2 restart your app when you reboot a host.
```

For front-end

```bash
##################################################
# In development
cd frontend && npm ci
npm start # Vite

npm run start2 # Farm
# Farm is faster than Vite and modern framework for front-end.
# But the framework is only available in Linux. No use in macosx and windows.
```

The end point will be <a href='http://localhost:4050'>http://localhost:4050</a>

Front-end deployment flow is super simple, because it's just static HTML.
Just locate the deployed files on nginx after built.

```bash
##################################################
# In Product
cd frontend && npm ci
npm run build # to "./dist" and base url will be "/"
BASE_URL=hogehoge npm run build # The react router will refer "/hogehoge" as base url.


##################################################
# Nginx example
.
.
.
root /home/johndoe/repos/frontend/dist;


location / {
    add_header Alt-Svc 'h3=":443"; ma=86400'; # QUIC/HTTP3

    # Prevent XSS
    add_header Referrer-Policy same-origin;
    add_header Cross-Origin-Opener-Policy same-origin;
    add_header Cross-Origin-Embedder-Policy require-corp;
    # No cache
    add_header Last-Modified $date_gmt;
    add_header Cache-Control 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
    if_modified_since off;
    expires off;
    etag off;

    # Index HTML
    index  index.html index.htm;

    # React Router
    try_files $uri /index.html;
}

location /api/ {
    add_header Alt-Svc 'h3=":443"; ma=86400'; # QUIC/HTTP3

    proxy_pass http://localhost:3050/; # To back-end
    proxy_http_version 1.1; # For express
    proxy_set_header Upgrade $http_upgrade; # For express

    # Proxy header
    proxy_cache_bypass $http_upgrade;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Server $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_buffers 8 64m;
    proxy_buffer_size 64m;
}

.
.
.


```

For compute node

```bash

##################################################
# In development
cd compute && npm ci

# Setup your config.json

npm start # development


##################################################
# In product, binary build (Linux/MacOSX)
npm run build # The binary will be into "./bin" directory.

```

The end point will be <a href='http://localhost:4050'>http://localhost:4050</a>

Front-end deployment flow is super simple, because it's just static HTML.
Just locate the deployed files on nginx after built.

<br>
<br>

## Model Definition

```javascript
${model_def}
```

<br>
<br>

## Docker (Docker Community Edition)

docker.io is maintained by Canonical, the same company as UbuntuOS, but we recommend docker-ce because it has many problems.
In particular, wsl2+ubuntu22.04+docker.io has a lot of problem.

```bash
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install docker-ce
sudo usermod -aG docker $USER

exit

```

```bash
johndoe@johndoe:/mnt/c/Users/johndoew$ docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

## nvidia-docker

In AMD, the ROCm has to manage /dev/card\*\*\* devices on your self, but nvidia provides GPU passthrough system on docker.
CUDA will be available on nvidia-docker plugin, and you can avoid a mismatch driver version problem between host and container.

[https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)

```bash
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg \
  && curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
    sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
    sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list \
  && \
    sudo apt-get update

sudo apt-get install -y nvidia-container-toolkit

sudo service docker restart # apply to docker

# Test
docker run --gpus all -it --rm nvidia/cuda:10.0-base nvidia-smi

```

## LXC/LXD (TODO)

The purpose of LXD is to create persistent containers.
It is located between a VM and a temporary container, is a container system maintained by Canonical, and is highly compatible with Ubuntu. By the way, First docker system was using LXC.

### Known issues

- ZFS disk leak problem

## Podman (TODO)

Docker desktop for macos has become a paid service, so podman support is likely to be available for free.

<br>
<br>
<br>

## Database installation tips for backend server

The database for the persistence part is based on Prisma and supports MySQL/Postgresql/SQLite, and supports Redis/Memcached/MemoryStore as session store. The default configuration is a combination of SQLite/MemoryStore for standalone. If you want to make your database persistent, choose MySQL or PostgreSQL. In session persistence or distributed backends, choose Redis or Memcached.

Redis

```bash
sudo apt install -y redis-server
sudo service redis start
```

Memcached

```bash
sudo apt install -y memcached
sudo service memcached start
```

SQLite

```bash
# Nothing to do.
```

PostgreSQL + Ubuntu22.04

```bash
sudo apt update && sudo apt install -y postgresql postgresql-contrib

# Make sure to connect
sudo -u postgres psql

ALTER ROLE postgres WITH password '<your password>'; # Change your favorite password.

# DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database_name>"
# Example,
#  DATABASE_URL=postgres://postgres:<your password>@localhost:5432/dmb

# Setup config.json.
# .
# .
#  "database": {
#    "driver": "prisma",
#    "drivers": {
#      "prisma": { "end_point": "postgres://postgres:<your password>@localhost:5432/dmb" },
#    }
#  },
#.
#.

# modify backend/prisma/schema.prisma file.
#
# datasource db {
#  provider = "sqlite"
#  url      = env("DATABASE_URL")
# }
#
# To
#
# datasource db {
#  provider = "postgres"
#  url      = env("DATABASE_URL")
# }

# Run "npm run init" or "npm run migrate"
# Prisma has something cache for definition. You need to refresh them when you changed the database engine.

```

MySQL(8) + Ubuntu22.04

```bash

# Install
sudo apt update && sudo apt install -y mysql-server

# Start
sudo systemctl start mysql.service


# Configuration
sudo mysql


mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '<your root password>';
mysql> exit


sudo mysql_secure_installation


# Create a new user and permit to connect from local network if you want.
mysql -u root -p
mysql> CREATE USER '<your name>'@'192.168.1.0/255.255.255.0' IDENTIFIED BY '<your password>';
mysql> GRANT ALL PRIVILEGES ON <database name>.* TO '<your name>'@'192.168.1.0/255.255.255.0' WITH GRANT OPTION;
# GRANT ALL PRIVILEGES ON dmb.* TO 'johndoe'@'192.168.1.0/255.255.255.0' WITH GRANT OPTION;
mysql> FLUSH PRIVILEGES;
mysql> exit
sudo systemctl restart mysql

```

<br>
<br>
<br>

Database initializer

```bash
npm run init # delete + migrate

npm run migrate # just migrate
```

GUI for SQLite(web)

```bash
npm run gui # for sqlite
```

GUI for PostgreSQL(desktop app)

```bash
sudo curl https://www.pgadmin.org/static/packages_pgadmin_org.pub | sudo apt-key add
sudo sh -c 'echo "deb https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list'

sudo apt update
sudo apt install -y pgadmin4

# Search pgAdmin4(desktop app) on app search box on Ubuntu GUI.
```

GUI for MySQL

- <s>MySQL Workbench</s> (Not recommended)
- DBeaver
- phpMyAdmin
- HeidiSQL(Windows)


### Jetson


In jetpack 4.6, docker has permission problem.
Please set permissions appropriately according to the command below.

```bash
sudo usermod -aG docker $USER
sudo chmod 666 /var/run/docker.sock
sudo service docker restart
exit # re-login
```



<br>
<br>
<br>
<br>
<br>