function convertToEST(inputDateString) {
    // Define the input and output date formats
    var inputFormat = new Packages.java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    var outputFormat = new Packages.java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    
    // Set the input format's timezone to UTC (assuming input is in UTC)
    inputFormat.setTimeZone(Packages.java.util.TimeZone.getTimeZone("UTC"));
    
    // Set the output format's timezone to EST
    outputFormat.setTimeZone(Packages.java.util.TimeZone.getTimeZone("EST"));
    
    // Parse the input date string
    var inputDate = inputFormat.parse(inputDateString);
    
    // Format the date to EST
    var estDateString = outputFormat.format(inputDate);
    
    return estDateString;
}