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


// This function is used inside S3BucketToMirthData() function
// to append each line of Hl7 Message & return the hl7 content back
function displayTextInputStream(inputStream){	
	var reader 	= new java.io.BufferedReader(new java.io.InputStreamReader(inputStream));
	var line 		= null;
	// Each Line of HL7 message will be looped and appended
	var hl7Message = new java.lang.StringBuilder();
	// reader.readLine() will read the lines of HL7 message 
	while ((line = reader.readLine()) != null) {
		hl7Message.append(line);
		hl7Message.append("\n");
	}
	return hl7Message.toString();
}
