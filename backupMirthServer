/**
    Creates a backup of the whole mirth configuration (like if you press the "backup config" button in Mirth Administrator) 
    and writes it to a folder.<br/>
    <br/>
    <i>The name of each backup is unique & all backups of one day will be written to a dedicated sub-folder named by the date</i>

    @param {String} username - The username that the channel should use to connect to the server that should be backed-up.
    @param {String} password - The password that the channel should use to connect to the server that should be backed-up.
    @param {String} server - The ip or name of the mirth server that should be backed-up. It can also contain a custom port. This parameter will become part of the backup name. 
    @param {String} backupFolder - Path to the folder where the backup should be created
    @param {String} archivePassword - If a password is provided, the zip archive will be encrypted with this password
*/
function backupMirthServer(username, password, server, backupFolder, archivePassword) {

   // logger.info('Initializing export of mirth server ' + server);

    // create a client instance and initialize it with the server to which it should connect
    var client = new com.mirth.connect.client.core.Client('https://' + server + ((server.indexOf(':') == -1) ? ':8443' : ''));
    // create an instance of the serializer used to serialize the configuration to xml
    var  serializer = com.mirth.connect.model.converters.ObjectXMLSerializer.getInstance();
    // log on to the server
    try{
        var loginStatus = client.login(username, password);
    }catch(ex){
        throw 'Unable to log-on the server "' + server + '" with credentials ' + username + '/' + password + ' (incompatible mirth version?): ' + ex.message;
    }
    
    // check if login was successful
    if (loginStatus.getStatus() != com.mirth.connect.model.LoginStatus.Status.SUCCESS) {
        logger.error('Unable to log-on the server "' + server + '" with credentials ' + username + '/' + password + '(status ' + loginStatus.getStatus() + ')');
        return;
    }

        try {
        // get the server configuration
        var configuration = client.getServerConfiguration();
        // get the current date as string
        var backupDate = new String(DateUtil.getCurrentDate('yyyy-MM-dd HH:mm:ss'));
        var todaysFolder = new String(DateUtil.getCurrentDate('yyyy-MM-dd'));

        // check if user has appropriate permissions to write to the backup folder
        if(!java.nio.file.Files.isWritable(java.nio.file.Paths.get(backupFolder))){
            logger.error('No permissions to write to folder "' + backupFolder + '"');
            throw 'No permissions to write to folder "' + backupFolder + '"';
        }
        
        // generate the complete backupPath of the backup file
        var backupFolder = (new String(backupFolder)).replace(/\\/g, '/') + '/' + todaysFolder;
        var backupPath = backupFolder + '/' + server.replace(/:/g, '-') + '_' + backupDate.replace(/:/g, '-') + '.zip';
        // set the date of the backup in the server configuration
        configuration.setDate(backupDate);
        
        // create the directory if not existant
        org.apache.commons.io.FileUtils.forceMkdir(new java.io.File(backupFolder));
        // create the archive
        var archive = new net.lingala.zip4j.core.ZipFile(backupPath);
        // and set the compression parameters
        var archiveParameters = new net.lingala.zip4j.model.ZipParameters();
        archiveParameters.setCompressionMethod(net.lingala.zip4j.util.Zip4jConstants.COMP_DEFLATE);
        // and set the highest (and slowest) compression rate possible
        archiveParameters.setCompressionLevel(net.lingala.zip4j.util.Zip4jConstants.DEFLATE_LEVEL_ULTRA);
        // indicate that thei files will be streamed to the archive
        archiveParameters.setSourceExternalStream(true);
        
        // if a password was provided, encrypt the archive
        if ((archivePassword !== undefined) && archivePassword) {
            // activate encryption if password for archive is set
            archiveParameters.setEncryptFiles(true);
            // set the encryption algorithm
            archiveParameters.setEncryptionMethod(net.lingala.zip4j.util.Zip4jConstants.ENC_METHOD_AES);
            // and also the encrpytion strength
            archiveParameters.setAesKeyStrength(net.lingala.zip4j.util.Zip4jConstants.AES_STRENGTH_256);
            // set the password of the encrypted archive
            archiveParameters.setPassword(archivePassword);
        }
        
        // 1.) export the mirth configuration to the archive
        // create an xml representation of the configuration object
        configuration = serializer.serialize(configuration);
        // create a streem from the xml
        configuration = new java.io.ByteArrayInputStream(configuration.getBytes());
        logger.info('Exporting configuration of mirth server "' + server + '"');
        // set the filename for the server configuration in the archive
        archiveParameters.setFileNameInZip(server + '_' + backupDate.replace(/:/g, '-') + '.xml');
        // and write the file to the archive
        archive.addStream(configuration, archiveParameters);

        //2.) export the configuration map to the archive 
        // set the filename for the server configuration in the archive
        archiveParameters.setFileNameInZip('configuration.properties');
        var configMap = getConfigurationProperties(client);
        // and write the file to the archive
        archive.addStream(configMap, archiveParameters);

        // end the session
        client.logout();
        // and close the client instance
        client.close();
        logger.info('Configuration of mirth server "' + server + '" has been exported to "' + backupPath + '"');
    } catch (ex) {
        logger.error('unable to write file "' + backupPath + '": ' + ex.message);
    } finally{
        try{file.close();}catch(e){}
        try{configMap.close();}catch(e){}
    }
}


/**
    Provides the configuration map as an imput stream.
*/
function getConfigurationProperties(client){
    // prepare structure
    var properties = new org.apache.commons.configuration.PropertiesConfiguration();
    // no fancy parsing here just a standard container
    properties.setDelimiterParsingDisabled(true);
    properties.setListDelimiter(0);
    properties.clear();
    var layout = properties.getLayout();

    // order the properties - basically just like the mirth admin does
    var sortedMap = java.util.TreeMap(java.lang.String.CASE_INSENSITIVE_ORDER);
    sortedMap.putAll(client.getConfigurationMap());

    // change the layout for obtainin
    for (var iterator = sortedMap.entrySet().iterator(); iterator.hasNext();) {
        var entry = iterator.next();

        var key = entry.getKey();
        // if the key is left emty, this entry is invalid and therefore skipped
        if(!key){continue;}
        
        var value = entry.getValue().getValue();
        var comment = entry.getValue().getComment();
        properties.setProperty(key, value);
        
        layout.setComment(key, comment ? comment : null);
    }
    
    // now write the file to a stream. Let's do everything on the fly
    var exportMap = new java.io.ByteArrayOutputStream();
    properties.save(exportMap);

    // provide an input stream that can directly be written to the archive
    return new java.io.ByteArrayInputStream(exportMap.toByteArray());
}
