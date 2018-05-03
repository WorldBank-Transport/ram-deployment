## RAM Project CloudFormation Deployment

## Requirements

- nodejs 8 or higher
- yarn (not required but preferred)

## Installation

     $ yarn
     $ cp .kes/.env.sample .kes/.env

## Deployment

- create an S3 bucket for the CF config (eg. `ram-cf-bucket`)
- edit `.kes/config.yml` and add a new deployment key with a new stack and bucket names  
```yaml
mydeployment:
  stackName: mystackName
  bucket: myBucket
```
- Deploy with Kes  
     $ ./node_modules/.bin/kes cf deploy --deployment mydeployment --region us-east-1 --profile nameOfMyawsProfile
