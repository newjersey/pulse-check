import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Runtime, FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda'
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Bucket, BlockPublicAccess } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Distribution, ViewerProtocolPolicy, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { join } from 'path';

export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const fn = new NodejsFunction(this, 'lambda', {
      entry: 'lambda/index.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_20_X,
    })
    fn.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    })
    new LambdaRestApi(this, 'pulse-check-api', {
      handler: fn,
    })


    // // Create an S3 bucket to host the React app
    // const websiteBucket = new Bucket(this, 'WebsiteBucket', {
    //   websiteIndexDocument: 'index.html',
    //   blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    // });

    // // Deploy React app to S3
    // new BucketDeployment(this, 'DeployWebsite', {
    //   sources: [Source.asset(join(__dirname, '../react-app/build'))],
    //   destinationBucket: websiteBucket,
    // });

    // // Create a CloudFront Origin Access Identity
    // const originAccessIdentity = new OriginAccessIdentity(this, 'OAI');

    // // Grant CloudFront access to the S3 bucket
    // websiteBucket.grantRead(originAccessIdentity);

    // // Create a CloudFront distribution to serve the React app
    // const distribution = new Distribution(this, 'WebsiteDistribution', {
    //   defaultBehavior: {
    //     origin: new S3BucketOrigin(websiteBucket),
    //     viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    //   },
    //   defaultRootObject: 'index.html',
    // });

    // // Output the CloudFront URL
    // new CfnOutput(this, 'DistributionDomainName', {
    //   value: distribution.distributionDomainName,
    // });
  }
}
