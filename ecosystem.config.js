module.exports = {
  apps: [{
    name: "webhook2websocket",
    script: "index.js",
  }],
  deploy: {
    production: {
      user: "ec2-user",
      host: "ec2-52-59-246-35.eu-central-1.compute.amazonaws.com",
      key: "~/.ssh/parkup-aws.pem",
      ref: "origin/master",
      repo: "git@github.com:pke/webhook2websocket.git",
      path: "/home/ec2-user/webhook2websocket",
      "post-deploy": "npm install && pm2 startOrRestart ecosystem.config.js"
    }
  }
}
