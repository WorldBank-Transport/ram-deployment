## RAM Deployment
This repository contains CloudFormation configuration to run a stack of the Rural Accessibility Map on AWS. It spins up:

- a machine to run [the API](https://github.com/WorldBank-Transport/ram-backend)
- a machine with Nginx to run [the interface](https://github.com/WorldBank-Transport/ram-frontend)
- Fargate instances for [the background processes](https://github.com/WorldBank-Transport/ram-datapipeline)
- RDS for the database
- a S3 bucket for file storage

More information about RAM can be found [in the docs](https://ruralaccess.info).

## Requirements

- nodejs 8 or higher

## Installation

```
$ yarn
$ cp .kes/.env.sample .kes/.env
```

## Setting up the first stack
The first time you set up an instance, you will have to create the following through AWS:

1. A S3 bucket where the CloudFormation configuration will be stored. This bucket can be shared by different stacks.
2. A [key pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html#having-ec2-create-your-key-pair), which can also be shared by multiple stacks in the same account.
3. Add both to the `config.yml`:  
  - the S3 bucket under `default.bucket`
  - the key pair under `default.ecs.keyPairName`
4. Set the environment variables in `.kes/.env`. These are shared among stacks.

## Deploying a stack
In `config.yml`:

1. Add a new stack to the configuration  
The new stack will inherit all configuration from the default stack. It's possible to override some or all of the configuration.
```
ram-my-deployment:
  stackName: ram-another-instance
```
2. run kes deploy  
`./node_modules/.bin/kes cf deploy --deployment ram-my-deployment --region us-east-1` This deploys the default stack. KES will use the default AWS credentials. To use a different profile, pass `--profile [...]`.
5. setup initial DB structure  

This is only needed the first time you bring up the stack.  
Find the postgres connection string in the RDS interface, add it to `local.js` on the `ram-backend` and run `yarn run setup -- --db`
6. go to ECS console to find out the IP of the frontend machine. RAM will be accessible through that IP

## Deleting a stack
Deleting a stack will bring all resources down, but keep the S3 bucket that was created by the stack for file storage. It can be manually deleted.

## Validating CloudFormation
To validate the CloudFormation configuration without deploying the stack, you can run:

`./node_modules/.bin/kes cf validate`

This will generate the `.kes/cloudformation.yml`.
