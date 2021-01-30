import { EcrRepository } from './.gen/providers/aws/ecr-repository';
import { EcsService } from './.gen/providers/aws/ecs-service'
import { EcsTaskDefinition } from './.gen/providers/aws/ecs-task-definition'
import { EcsCluster } from './.gen/providers/aws/ecs-cluster'
import { App, TerraformOutput, TerraformStack } from 'cdktf'
import { Construct } from 'constructs'
import { Instance } from './.gen/providers/aws/instance'
import { AwsProvider } from './.gen/providers/aws/aws-provider'
import { Container, Image } from "./.gen/providers/docker"
import { DockerProvider } from './.gen/providers/docker'

class Aws extends TerraformStack {
	constructor(scope: Construct, name: string) {
		super(scope, name)
		
		new DockerProvider(this, 'default', {})
		const { latest } = new Image(this, 'nginxImage', {
			name: 'nginx:latest',
			keepLocally: false,
		})
		const container = new Container(this, 'nginxContainer', {
			image: latest,
			name: 'tutorial',
			ports: [
				{
					internal: 80,
					external: 8000,
				},
			],
		})
		new EcrRepository(this, 'image', { name })
		const cluster = new EcsCluster(this, 'cluster', { name })
		new EcsTaskDefinition(this, 'task', { 
			containerDefinitions: JSON.stringify([{
				name: container.name,
				image: container.image,
				memory: 1024,
				ports: {
					containerPort: 80,
					hostPort: 8000,
				},
				cpu: 1,
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
new Aws(app, 'typescript-aws')
app.synth()
