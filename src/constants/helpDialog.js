import helpDialog from '../models/helpDialogModel'

export default {
  getHelpForIntegratingAwsAccounts () {
    const AWS_ACCOUNT_INTEGRATION_HELP_TITLE = 'Integrating an AWS account';
    const AWS_ACCOUNT_INTEGRATION_HELP_CONTENT = `This page allows you to integrate an AWS Account with the service. Before specifying credentials w.r.t an IAM user, please make sure that the user
    is configured with the needed policies. To create an integration, the IAM user access key ID and the secret access key need to be specified. Also, please note that the Cost Governance service is dependent on
    AWS services to fetch spend related details. Accordingly, AWS exposes two services. <a href="https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html" target="blank">"Cost and Usage Reports (CUR)"</a> and <a href="https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/ce-what-is.html" target="blank">"Cost Explorer(CE)"</a>. You'll have to specify the service that you'd want the Cost Governance service to make use of.
    In addition, you'll have to specify the polling interval. This specifies the interval at which the Cost Governance service will reach out the specified service to gather spend related details associated with an account`;
    return new helpDialog(AWS_ACCOUNT_INTEGRATION_HELP_TITLE, AWS_ACCOUNT_INTEGRATION_HELP_CONTENT);
  }
}
