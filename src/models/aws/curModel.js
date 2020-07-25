export  default class {
  constructor (curJson) {
    this.reportName = curJson["ReportName"];
    this.s3Bucket = curJson["S3Bucket"];
    this.reportPrefix = curJson["S3Prefix"];
  }

  getReportName () {
    return this.reportName;
  }

  getS3Bucket () {
    return this.s3Bucket;
  }

  getReportPrefix () {
    return this.reportPrefix;
  }

}
