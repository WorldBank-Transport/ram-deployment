const { Kes } = require('kes');

// Override the KES class to include useful post-deploy helpers
class UpdatedKes extends Kes {
  opsStack() {
    return super.opsStack()
      .then(() => this.describeCF())
      .then((r) => {
        let output = r.Stacks[0].Outputs
        let frontendAddress = output.find(o => o.OutputKey === 'frontendIpAddress')['OutputValue']
        let apiAddress = output.find(o => o.OutputKey === 'apiIpAddress')['OutputValue']
        let dbConnection = output.find(o => o.OutputKey === 'dbConnectionString')['OutputValue']

        return console.log(
          `The stack ${r.Stacks[0].StackName} is deployed or updated. The main components are available through:
  - frontend: ${frontendAddress}
  - backend: ${apiAddress}
  - db connection string: ${dbConnection}`
      )
    })
  }
}

module.exports = UpdatedKes;
