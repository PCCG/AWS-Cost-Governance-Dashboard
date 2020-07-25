import IntegrationStepDialog from '@/models/generic/integrations/aws/integrationStepModel'


export default {
  1: new IntegrationStepDialog('IAM Credentials', 'Specify IAM user credentials'),
  2: new IntegrationStepDialog('Setup CUR', 'Select the report you want to make use of')  
}
