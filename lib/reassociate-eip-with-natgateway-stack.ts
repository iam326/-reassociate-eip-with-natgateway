import * as cdk from '@aws-cdk/core';
import { CfnNatGateway, Vpc, SubnetType } from '@aws-cdk/aws-ec2';

export class ReassociateEipWithNatgatewayStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'Vpc', {
      cidr: '10.0.0.0/16',
      enableDnsHostnames: true,
      enableDnsSupport: true,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'PublicSubnet',
          subnetType: SubnetType.PUBLIC,
        },
      ],
      natGateways: 2,
      maxAzs: 2,
    });

    const allocationIds: string[] = this.node.tryGetContext('eipAllocationIds');
    vpc.publicSubnets.forEach((subnet, index) => {
      // 各 Subnet から NAT Gateway を探す
      const natGateway = subnet.node.children.find(
        (child) => child.node.id == 'NATGateway'
      ) as CfnNatGateway;
      // 自動で作成された EIP を削除する
      subnet.node.tryRemoveChild('EIP');
      // 事前に作成した EIP を設定する
      natGateway.allocationId = allocationIds[index];
    });
  }
}
