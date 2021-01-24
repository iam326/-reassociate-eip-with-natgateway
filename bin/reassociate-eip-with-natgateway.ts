#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ReassociateEipWithNatgatewayStack } from '../lib/reassociate-eip-with-natgateway-stack';

const app = new cdk.App();
new ReassociateEipWithNatgatewayStack(app, 'ReassociateEipWithNatgatewayStack');
