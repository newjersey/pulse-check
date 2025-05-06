import { Stack, StackProps, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Runtime, FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Bucket, BlockPublicAccess, ObjectOwnership, BucketAccessControl, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Distribution, ViewerProtocolPolicy, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { join } from 'path';
import { ArnPrincipal, ServicePrincipal } from 'aws-cdk-lib/aws-iam';


export class PulseCheckBackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const websiteBucket = new Bucket(this, 'PulseCheckBucket', {
      autoDeleteObjects: true,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.DESTROY,
      websiteIndexDocument: 'index.html',
      minimumTLSVersion: 1.3,
      encryption: BucketEncryption.S3_MANAGED,
      // blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
      publicReadAccess: true,
    });

    // Deploy React app to S3
    const deployment = new BucketDeployment(this, 'PulseCheckDeployment', {
      sources: [Source.asset(join(__dirname, '../../frontend/dist'))],
      destinationBucket: websiteBucket,
    });

    // // Create a CloudFront Origin Access Identity
    // const originAccessIdentity = new OriginAccessIdentity(this, 'OAI');

    // // Grant CloudFront access to the S3 bucket
    // websiteBucket.grantRead(originAccessIdentity);

    // Create a CloudFront distribution to serve the React app
    // const distribution = new Distribution(this, 'PulseCheckDistribution', {
    //   defaultBehavior: {
    //     origin: S3BucketOrigin.withOriginAccessIdentity(websiteBucket, { originAccessIdentity }),
    //     viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    //   },
    //   defaultRootObject: 'index.html',
    // });

    // // Output the CloudFront URL
    // new CfnOutput(this, 'PulseCheckDistributionDomainName', {
    //   value: distribution.distributionDomainName,
    // });

    const apiHandler = new NodejsFunction(this, 'PulseCheckHandler', {
      entry: 'api/index.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_20_X,
    })

    const apiUrl = apiHandler.addFunctionUrl({
      authType: FunctionUrlAuthType.AWS_IAM,
    })

    apiHandler.addPermission(
      'PulseCheckPermission',
      { principal: new ServicePrincipal('s3.amazonaws.com'), sourceArn: websiteBucket.bucketArn }
    )
  }
}
