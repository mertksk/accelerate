module.exports = {
  apps: [
    {
      name: 'accelerate',
      script: 'npm',
      args: 'start',
      cwd: '/home/mertksk/accelerate',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/home/mertksk/logs/accelerate-error.log',
      out_file: '/home/mertksk/logs/accelerate-out.log',
      log_file: '/home/mertksk/logs/accelerate-combined.log',
      time: true
    }
  ]
};
