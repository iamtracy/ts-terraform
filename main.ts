import { App, TerraformOutput, TerraformStack } from 'cdktf'
import { Construct } from 'constructs'
import { EcrRepository } from './.gen/providers/aws/ecr-repository'
import { EcsService } from './.gen/providers/aws/ecs-service'
import { EcsTaskDefinition } from './.gen/providers/aws/ecs-task-definition'
import { EcsCluster } from './.gen/providers/aws/ecs-cluster'
import { Instance } from './.gen/providers/aws/instance'
import { AwsProvider } from './.gen/providers/aws/aws-provider'

class Stack extends TerraformStack {
	constructor(scope: Construct, name: string) {
		super(scope, name)
		
		new EcrRepository(this, 'image', { name })
		const cluster = new EcsCluster(this, 'cluster', { name })
		new EcsTaskDefinition(this, 'task', { 
			containerDefinitions: JSON.stringify([{
				name: 'nginxImage',
				image: 'sha256:f6d0b4767a6c466c178bf718f99bea0d3742b26679081e52dbf8e0c7c4c42d74',
				memory: 1024,
				ports: {
					containerPort: 80,
					hostPort: 8000,
				},
				cpu: 2,
			}] as Array<Partial<{}>>),
			family: name
		})
		new EcsService(this, 'service', { name, taskDefinition: name, cluster: cluster.id })

		new AwsProvider(this, 'aws', { region: 'us-west-1' })

    const { publicIp } = new Instance(this, 'compute', {
      ami: 'ami-01456a894f71116f2',
      instanceType: 't2.micro',
      tags: {
        Name: 'TypeScript-Demo',
        fruit: 'blueberry',
        Address: '123 Main St',
      },
    })

    new TerraformOutput(this, 'public_ip', {
      value: publicIp,
    })
  }
}

const app = new App()
new Stack(app, 'typescript-aws')
app.synth()
