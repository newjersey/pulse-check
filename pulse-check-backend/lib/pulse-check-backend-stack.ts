import { Stack, StackProps, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Runtime, FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda'
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Bucket, BlockPublicAccess } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Distribution, ViewerProtocolPolicy, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { join } from 'path';

export class PulseCheckBackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const apiHandler = new NodejsFunction(this, 'PulseCheckHandler', {
      entry: 'api/index.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_20_X,
    })

    apiHandler.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    })

    new LambdaRestApi(this, 'PulseCheckApi', {
      handler: apiHandler,
    })

    // Create an S3 bucket to host the React app
    const websiteBucket = new Bucket(this, 'PulseCheckBucket', {
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
      websiteIndexDocument: 'index.html',
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    });

    // Deploy React app to S3
    new BucketDeployment(this, 'PulseCheckDeployment', {
      sources: [Source.asset(join(__dirname, '../../frontend/dist'))],
      destinationBucket: websiteBucket,
    });

    // Create a CloudFront Origin Access Identity
    const originAccessIdentity = new OriginAccessIdentity(this, 'OAI');

    // Grant CloudFront access to the S3 bucket
    websiteBucket.grantRead(originAccessIdentity);

    // Create a CloudFront distribution to serve the React app
    const distribution = new Distribution(this, 'PulseCheckDistribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessIdentity(websiteBucket, { originAccessIdentity }),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
    });

    // Output the CloudFront URL
    new CfnOutput(this, 'PulseCheckDistributionDomainName', {
      value: distribution.distributionDomainName,
    });
  }
}
