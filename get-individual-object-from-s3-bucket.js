// Fetch Data (Individual files) from the S3 Bucket and get the FileName List
function S3BucketToMirthData(accessId, Key, bucketName,region,s3ObjectName){
	var obj 		= "";
	var value 	= "";
	// Loading the credentials
	var creds 	= new Packages.com.amazonaws.auth.BasicAWSCredentials(accessId, Key);
	var s3Client 	= new Packages.com.amazonaws.services.s3.AmazonS3ClientBuilder.standard().withRegion(region).withCredentials(new com.amazonaws.auth.AWSStaticCredentialsProvider(creds)).build();
	try{
		// Get individual message from the S3 Bucket
		obj 		= s3Client.getObject(bucketName, s3ObjectName);
		// The getObjectContent() will fetch the entire message as string
		value 	= displayTextInputStream(obj.getObjectContent());
	}catch(e){
		logger.debug("Error on the S3 bucket data fetching");
	}
	return value;
}