const { Kes } = require('kes');

// Override the KES class to include useful post-deploy helpers
class UpdatedKes extends Kes {
  opsStack() {
    return super.opsStack()
      .then(() => this.describeCF())
      .then((r) => console.log(
        `The stack ${r.Stacks[0].StackName} is deployed or updated. The main components are available through:
  - frontend: ${r.Stacks[0].Outputs.find(o => o.OutputKey === 'frontendIpAddress')['OutputValue']}
  - backend: ${r.Stacks[0].Outputs.find(o => o.OutputKey === 'apiIpAddress')['OutputValue']}
  - database: ${r.Stacks[0].Outputs.find(o => o.OutputKey === 'rdsAddress')['OutputValue']}`
      ))
  }
}

module.exports = UpdatedKes;
