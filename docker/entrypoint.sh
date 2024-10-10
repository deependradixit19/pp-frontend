#!/bin/bash

# Create storage directory structure if it's not already created
/bin/mkdir -p /app/storage/app/public
/bin/mkdir -p /app/storage/framework/cache
/bin/mkdir -p /app/storage/framework/sessions
/bin/mkdir -p /app/storage/framework/testing
/bin/mkdir -p /app/storage/framework/views
/bin/mkdir -p /app/storage/logs

# Fix for storage directory not following permissions as expected
# when creating some subdirectories as a root user
/bin/chown -R application:application /app/storage
/bin/chmod -R 777 /app/storage

# --- ARTISAN---
# Artisan commands go here
# NOTE: Make sure to use absolute PHP runtime and Artisan file paths!
# NOTE: Make sure to start the command with '/bin/su application -c' as this part runs the command under the appropriate user

/bin/su application -c '/usr/local/bin/php /app/artisan migrate --force'

# --------------

supervisord
