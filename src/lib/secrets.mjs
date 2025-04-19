import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

const AWS_REGION = process.env.AWS_REGION;

const DATABASE_URL_SSM_PARAM = `/serverless-framework/deployment/database-url`;


async function getDbUrl() {
    const ssmClient = new SSMClient({ region: AWS_REGION });
    const paramStoreData = {
        Name: DATABASE_URL_SSM_PARAM,
        WithDecryption: true,
    }
    const command = new GetParameterCommand(paramStoreData);
    const result = await ssmClient.send(command);
    return result.Parameter.Value;
}

export { getDbUrl };
