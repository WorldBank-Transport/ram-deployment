<h1 align="center">RAM Deployment</h1>

This repository contains CloudFormation configuration to run a stack of the Rural Accessibility Map on AWS. It spins up:

- a machine to run [the API](https://github.com/WorldBank-Transport/ram-backend)
- a machine with Nginx to run [the interface](https://github.com/WorldBank-Transport/ram-frontend)
- Fargate instances for [the background processes](https://github.com/WorldBank-Transport/ram-datapipeline)
- RDS for the database
- a S3 bucket for file storage

More information about RAM can be found [in the docs](http://ruralaccess.info).

## Requirements

- nodejs 8 or higher
- yarn

## Installation

```
$ yarn
$ cp .kes/.env.sample .kes/.env
```

## Before the first deploy
Follow these steps before deploying the first stack:

* On AWS, manually create the following:  
  * A S3 bucket where the CloudFormation configuration will be stored. This bucket can be shared by different stacks.
  * A [key pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html#having-ec2-create-your-key-pair), which can also be shared by multiple stacks in the same account.
* Add both to the `.kes/config.yml`:  
  * the S3 bucket under `default.bucket`
  * the key pair under `default.ecs.keyPairName`
* Set the environment variables in `.kes/.env`

This configuration is shared between different stacks. If you run multiple stack, you only have to do this once.

## Deploying a stack
To deploy a new stack:

* Add a new stack to `.kes/config.yml`    
The new stack will inherit all configuration from the default stack. It's possible to override some or all of the configuration.
  ```
  ram-my-deployment:
    stackName: ram-another-instance
  ```
* run kes deploy  
`./node_modules/.bin/kes cf deploy --deployment ram-my-deployment --region us-east-1`.

After the initial deploy, set up the database structure:

* find the Postgres connection string in the RDS interface
* add this to `./setup/config.js`
* run `yarn setup --db`

Go to ECS console to find out the IP of the `frontend` machine. RAM will be accessible through that IP.

## Deleting a stack
Deleting a stack will take all resources down, but keep the S3 bucket that was created by the stack for file storage. It can be manually deleted.

## Validating CloudFormation
To validate the CloudFormation configuration without deploying the stack:

`./node_modules/.bin/kes cf validate`

This will generate the `.kes/cloudformation.yml`.
