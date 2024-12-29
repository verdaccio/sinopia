---
id: amazon
title: 'Amazon Web Services'
---

This document describes several approaches for deploying Verdaccio in the AWS cloud.

## EC2 {#ec2}

[CloudFormation template for deploying this stack.](https://github.com/verdaccio/verdaccio/blob/master/contrib/aws/cloudformation-ec2-efs.yaml)

Architecture:

```
Clients
 |
 | (HTTPS)
 v
Application Load Balancer
 |
 | (HTTP)
 v
EC2 Auto Scaling Group (Amazon Linux 2)
Docker image (Verdaccio)
 |
 | (NFS)
 v
Elastic File System
```

Architecture notes:

- Deploy this stack into the region closest to your users for maximum performance.
- We use an auto scaling group primarily for self-healing. The system requirements of Verdaccio are pretty low, so it's unlikely you'll need multiple instances to handle traffic load.
- Because Amazon Linux 2 doesn't include Node, we run Verdaccio as a Docker image rather than natively on the instance. This is faster and more secure than relying on third party package sources for Node.
- Elastic File System is cheap and stateful, and works across AZs. An alternative would be the [third-party S3 storage plugin](https://github.com/remitly/verdaccio-s3-storage).
  - For backup, use AWS Backup

Estimated monthly cost for a small installation (in us-east-1):

- ALB (1 LCU average): $22.265/mo
- EC2 (t3.nano): $3.796/mo
- EBS (8gb): $0.80/mo
- EFS (5gb): $1.5/mo
- Data transfer: (10gb): $0.9/mo
- **TOTAL:** Under $30/mo

## ECS {#ecs}

You can deploy Verdaccio as a task with an [ECS Volume](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html) for persistent storage.

Note: Fargate doesn't support persistent volumes, so you have to use the S3 storage plugin.

## EKS {#eks}

See the documentation pages on [Kubernetes](kubernetes) and [Docker](docker).

### Deploying Verdaccio on AWS

## Setup & Configuration {#setup--configuration}

**Step 1:** Open SSH & Login in using your EC2 key.

**Step 2:** Install Node Version Manager (nvm) first, close and re-open the SSH using your EC2 key.

`sudo apt update`

`wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash`

`exit`

**Step 3:** Install Node using Node Version Manager (nvm)

`nvm install node`

**Step 4:** Install Verdaccio & pm2, will require to run Verdaccio service in background

`npm i -g verdaccio pm2`

**Step 5:** Set the verdaccio registry as a source. By default original NPM registry set.

`npm set registry http://localhost:4873`

`npm set ca null`

**Step 6:** Run Verdaccio and stop it (ctrl+c). It will create a config file we will use.

`verdaccio`

**Step 7:** Now do below configuration for listening to all addresses on that server machine / EC2 instance. [(read more)](https://github.com/verdaccio/verdaccio/blob/master/conf/full.yaml)

Open and edit `config.yaml` file:

` nano .config/verdaccio/config.yaml` or ` nano ~/verdaccio/config.yaml`

Add below lines at the end. [(read more)](https://github.com/verdaccio/verdaccio/blob/ff409ab7c05542a152100e3bc39cfadb36a8a080/conf/full.yaml#L113)

```
listen:
 - 0.0.0.0:4873
```

Change below line so that only authenticated person can access our registry

`Replace "access: $all" with "access: $authenticated"`

(Optional) Change below line according to how many users you wish to grant access to the scoped registry

`Replace "#max_users: 1000" with "max_users: 1"`

There are some more parameters available to configure it. Like storage, proxy, default port change. [(read more)](https://github.com/verdaccio/verdaccio/blob/ff409ab7c05542a152100e3bc39cfadb36a8a080/conf/full.yaml#L113)

**Step 8:** Run Verdaccio in background using PM2:

`pm2 start verdaccio`

**Step 9:** Now, You can access your Verdaccio web UI.

The URL will look like something:

`http://ec2-..compute.amazonaws.com:4873`

or

`http://your-ec2-public-ip-address:4873 (You can check your EC2 instance public ip from AWS console)`

To confirm Verdaccio's running status, run the command below:

` pm2 list`

To make Verdaccio launch on startup, run the commands below:

`pm2 stop verdaccio`

`pm2 delete verdaccio`

`pm2 startup` This will show a command in your terminal. Copy / paste it and execute it to have pm2 make a startup service for you.

`which verdaccio` Copy the path shown by this command.

`pm2 start /home/ubuntu/.nvm/versions/node/v17.1.0/bin/verdaccio` (put the path you copied from command above).

`pm2 status` This should show "online" on the status of verdaccio service.

`pm2 save` Now when you reboot the EC2 instance, it should launch verdaccio.

**Step 10:** Registering a user in verdaccio registry

` npm adduser`

It will ask for username, password and valid email id to be entered. Make a note of this details that will use later to login in verdaccio registry to publish our library.

**Step 11:** Now we are ready to use our AWS server instance work as a private registry.

Login into verdaccio registry. Enter the same username, password and email id set in above Step.

` npm set registry http://your-ec2-public-ip-address:4873`

` npm login`

**Step 12:** Go to your custom library package path. In my case this is my Angular 7 package path -> `/libraries/dist/your-library-name/your-library-name-0.0.1.tgz`

If you like to know how to create angular 7 library/package then [(click here)](https://www.howtoinmagento.com/2019/11/how-to-create-your-first-angular-7.html)

` cd [custom library package path]`

**Step 13:** Finally publish our library `your-library-name-0.0.1.tgz` on verdaccio registry

` [custom library package path] >> npm publish your-library-name-0.0.1.tgz`

or

` [custom library package path] >> npm publish`

or

` [custom library package path] >> npm publish --registry http://your-ec2-public-ip-address:4873`

Now browse ` http://your-ec2-public-ip-address:4873` and you will see new library package there.
