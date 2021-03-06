#!/bin/bash

# Add a user group for the default user, and make it the owner of the /app
# directory.  Unzip stuff there and then set permissions.
groupadd eapd
gpasswd -a ec2-user eapd
mkdir /app
mkdir /app/api
mkdir /app/web

chown -R :eapd /app
chmod -R g+w /app

mkdir /app/tls

# Install nginx and postgres
amazon-linux-extras install nginx1.12
yum -y install git postgresql-server amazon-cloudwatch-agent

# Setup postgres
service postgresql initdb
echo "
# TYPE    DATABASE    USER    ADDRESS         METHODS
local     all         all                     peer
host      all         all     127.0.0.1/32    password
host      all         all     ::1/128         password
" > /var/lib/pgsql/data/pg_hba.conf
service postgresql start
sudo -u postgres psql -c "CREATE DATABASE hitech_apd;"
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'cms';"

# Create self-signed certificates
openssl genrsa -des3 -passout pass:x -out /app/tls/server.pass.key 2048
openssl rsa -passin pass:x -in /app/tls/server.pass.key -out /app/tls/server.key
rm -f /app/tls/server.pass.key
# Use the instance metadata service to get public hostname
openssl req -new -key /app/tls/server.key -out /app/tls/server.csr -subj "/CN=$(curl http://169.254.169.254/latest/meta-data/public-hostname)"
openssl x509 -req -sha256 -days 365 -in /app/tls/server.csr -signkey /app/tls/server.key -out /app/tls/server.crt
rm -f /app/tls/server.csr

# Create nginx config
cat <<NGINXCONFIG > /etc/nginx/nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '\$remote_addr - \$remote_user [\$time_local] "\$request" '
                      '\$status \$body_bytes_sent "\$http_referer" '
                      '"\$http_user_agent" "\$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    server {
        listen       443 default_server;
        listen       [::]:443 default_server;
        server_name  _;
        root         /app/web;

        ssl                 on;
        ssl_certificate     /app/tls/server.crt;
        ssl_certificate_key /app/tls/server.key;

        location /api/ {
          proxy_pass http://localhost:8000/;
        }

        location / {
          # For requests without a file extension, send the requested path if
          # it exists, otherwise send index.html to achieve push state routing
          try_files \$uri /index.html;
        }

        location ~ ^.+\..+\$ {
          # For requests with file extensions, send them if the file exists,
          # otherwise send a 404.
          try_files \$uri =404;
        }
    }
}
NGINXCONFIG
service nginx restart

# Configure CloudWatch Agent
cat <<CWAGENTCONFIG > /opt/aws/amazon-cloudwatch-agent/doc/cwagent.json

{
        "agent": {
                "metrics_collection_interval": 60,
                "run_as_user": "cwagent"
        },
        "metrics": {
                "append_dimensions": {
                        "AutoScalingGroupName": "${aws:AutoScalingGroupName}",
                        "ImageId": "${aws:ImageId}",
                        "InstanceId": "${aws:InstanceId}",
                        "InstanceType": "${aws:InstanceType}"
                },
                "metrics_collected": {
                        "collectd": {
                                "metrics_aggregation_interval": 30
                        },
                        "cpu": {
                                "measurement": [
                                        "cpu_usage_idle",
                                        "cpu_usage_iowait",
                                        "cpu_usage_user",
                                        "cpu_usage_system"
                                ],
                                "metrics_collection_interval": 60,
                                "totalcpu": false
                        },
                        "disk": {
                                "measurement": [
                                        "used_percent",
                                        "inodes_free"
                                ],
                                "metrics_collection_interval": 60,
                                "resources": [
                                        "*"
                                ]
                        },
                        "diskio": {
                                "measurement": [
                                        "io_time"
                                ],
                                "metrics_collection_interval": 60,
                                "resources": [
                                        "*"
                                ]
                        },
                        "mem": {
                                "measurement": [
                                        "mem_used_percent"
                                ],
                                "metrics_collection_interval": 60
                        },
                        "statsd": {
                                "metrics_aggregation_interval": 30,
                                "metrics_collection_interval": 60,
                                "service_address": ":8125"
                        },
                        "swap": {
                                "measurement": [
                                        "swap_used_percent"
                                ],
                                "metrics_collection_interval": 60
                        }
                }
        }
}

CWAGENTCONFIG

# Nginx is preview only
cat <<CWVARLOGCONFIG > /opt/aws/amazon-cloudwatch-agent/doc/var-log.json
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/aide/aide.log*",
            "log_group_name": "preview/var/log/aide/aide.log"
          },
          {
            "file_path": "/var/log/audit/audit.log*",
            "log_group_name": "preview/var/log/audit/audit.log"
          },
          {
            "file_path": "/var/log/awslogs.log*",
            "log_group_name": "preview/var/log/awslogs.log"
          },
          {
            "file_path": "/var/log/cloud-init.log*",
            "log_group_name": "preview/var/log/cloud-init.log"
          },
          {
            "file_path": "/var/log/cloud-init-output.log*",
            "log_group_name": "preview/var/log/cloud-init-output.log"
          },
          {
            "file_path": "/var/log/cron*",
            "log_group_name": "preview/var/log/cron"
          },
          {
            "file_path": "/var/log/dmesg*",
            "log_group_name": "preview/var/log/dmesg"
          },
          {
            "file_path": "/var/log/maillog*",
            "log_group_name": "preview/var/log/maillog"
          },
          {
            "file_path": "/var/log/messages*",
            "log_group_name": "preview/var/log/messages"
          },
          {
            "file_path": "/var/log/nginx/access_log*",
            "log_group_name": "preview/var/log/nginx/access_log"
          },
          {
            "file_path": "/var/log/nginx/error_log*",
            "log_group_name": "preview/var/log/nginx/error_log"
          },
          {
            "file_path": "/var/log/secure*",
            "log_group_name": "preview/var/log/secure"
          }
        ]
      }
    }
  }
}

CWVARLOGCONFIG

cat <<CWVAROPTCONFIG > /opt/aws/amazon-cloudwatch-agent/doc/var-opt.json
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/opt/ds_agent/diag/ds_agent.log*",
            "log_group_name": "preview/var/opt/ds_agent/diag/ds_agent.log"
          },
          {
            "file_path": "/var/opt/ds_agent/diag/ds_agent-err.log*",
            "log_group_name": "preview/var/opt/ds_agent/diag/ds_agent-err.log"
          },
          {
            "file_path": "/var/opt/ds_agent/diag/ds_am.log*",
            "log_group_name": "preview/var/opt/ds_agent/diag/ds_am.log"
          }
        ]
      }
    }
  }
}

CWVAROPTCONFIG

cat <<CWAPPLOGCONFIG > /opt/aws/amazon-cloudwatch-agent/doc/app-logs.json

{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/home/ec2-user/.pm2/logs/eAPD-API-error-0.log*",
            "log_group_name": "preview/home/ec2-user/.pm2/logs/eAPD-API-error-0.log"
          },
          {
            "file_path": "/home/ec2-user/.pm2/logs/eAPD-API-out-0.log*",
            "log_group_name": "preview/home/ec2-user/.pm2/logs/eAPD-API-out-0.log"
          }    
        ]
      }
    }
  }
}

CWAPPLOGCONFIG

/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -s -c file:/opt/aws/amazon-cloudwatch-agent/doc/cwagent.json

/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a append-config -m ec2 -s -c file:/opt/aws/amazon-cloudwatch-agent/doc/var-log.json

/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a append-config -m ec2 -s -c file:/opt/aws/amazon-cloudwatch-agent/doc/var-opt.json

/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a append-config -m ec2 -s -c file:/opt/aws/amazon-cloudwatch-agent/doc/app-logs.json

# Become the default user. Everything between "<<E_USER" and "E_USER" will be
# run in the context of this su command.
su ec2-user <<E_USER

# The su block begins inside the root user's home directory.  Switch to the
# ec2-user home directory.
export OKTA_DOMAIN="__OKTA_DOMAIN__"
export OKTA_SERVER_ID="__OKTA_SERVER_ID__"
export OKTA_CLIENT_ID="__OKTA_CLIENT_ID__"
export OKTA_API_KEY="__OKTA_API_KEY__"

cd ~

# Install nvm.  Do it inside the ec2-user home directory so that user will have
# access to it forever, just in case we need to get into the machine and
# manually do some stuff to it.
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
source ~/.bashrc

# We're using Node 10, and we don't care about minor/patch versions, so always
# get the latest.
nvm install 10
nvm alias default 10

# Install pm2: https://www.npmjs.com/package/pm2
# This is what'll manage running the API Node app. It'll keep it alive and make
# sure it's running when the EC2 instance restarts.
npm i -g pm2

# Clone from Github
git clone --single-branch -b __GIT_BRANCH__ https://github.com/CMSgov/eAPD.git

# Build the web app and move it into place
cd eAPD/web
npm ci
API_URL=/api/ OKTA_DOMAIN="__OKTA_DOMAIN__" npm run build
mv dist/* /app/web
cd ~

# Move the API code into place, then go set it up
mv eAPD/api/* /app/api
cd /app/api

npm ci --only=production

# Build and seed the database
NODE_ENV=development DEV_DB_HOST=localhost npm run migrate
NODE_ENV=development DEV_DB_HOST=localhost npm run seed

# pm2 wants an ecosystem file that describes the apps to run and sets any
# environment variables they need.  The environment variables are sensitive,
# so we won't put them here.  Instead, the CI/CD process should replace
# "__ECOSYSTEM__" with a base64-encoded JSON string of an ecosystem file.
echo "module.exports = {
  apps : [{
    name: 'eAPD API',
    script: 'main.js',
    instances: 1,
    autorestart: true,
    env: {
      AUTH_LOCK_FAILED_ATTEMPTS_COUNT: 15,
      AUTH_LOCK_FAILED_ATTEMPTS_WINDOW_TIME_MINUTES: 1,
      AUTH_LOCK_FAILED_ATTEMPTS_DURATION_MINUTES: 10,
      FILE_PATH: '__files',
      FILE_STORE: 'local',
      NODE_ENV: 'development',
      PBKDF2_ITERATIONS: '__PBKDF2_ITERATIONS__',
      PORT: '8000',
      DEV_DB_HOST: 'localhost',
      DISABLE_SAME_SITE: 'yes',
      OKTA_DOMAIN: '__OKTA_DOMAIN__',
      OKTA_SERVER_ID: '__OKTA_SERVER_ID__',
      OKTA_CLIENT_ID: '__OKTA_CLIENT_ID__',
      OKTA_API_KEY: '__OKTA_API_KEY__'

    },
  }]
};" > ecosystem.config.js

# Start it up
pm2 start ecosystem.config.js

E_USER

# Setup pm2 to start itself at machine launch, and save its current
# configuration to be restored when it starts
su - ec2-user -c '~/.bash_profile; sudo env PATH=$PATH:/home/ec2-user/.nvm/versions/node/v10.15.3/bin /home/ec2-user/.nvm/versions/node/v10.15.3/lib/node_modules/pm2/bin/pm2 startup systemd -u ec2-user --hp /home/ec2-user'
su - ec2-user -c 'pm2 save'
