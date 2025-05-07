import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Runtime, FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Bucket, BlockPublicAccess, BucketEncryption, HttpMethods } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { join } from 'path';


export class PulseCheckBackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const websiteBucket = new Bucket(this, 'PulseCheckBucket', {
      autoDeleteObjects: true,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.DESTROY,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      minimumTLSVersion: 1.3,
      encryption: BucketEncryption.S3_MANAGED,
      publicReadAccess: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
      cors: [{ allowedOrigins: ['*'], allowedMethods: [HttpMethods.GET, HttpMethods.HEAD] }]
    });

    new BucketDeployment(this, 'PulseCheckDeployment', {
      sources: [Source.asset(join(__dirname, '../../frontend/dist'))],
      destinationBucket: websiteBucket,
    });

    const apiHandler = new NodejsFunction(this, 'PulseCheckHandler', {
      entry: 'api/index.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_20_X,
    })

    apiHandler.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
      cors: {
        allowCredentials: true,
        allowedOrigins: ["https://pulsecheckbackendstack-pulsecheckbucket390707aa-ravwp0vqnndq.s3.us-east-1.amazonaws.com"],
        allowedHeaders: ["Content-Type", "Authorization", "Accept"],
      },
    })
  }
}
