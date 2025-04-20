import { SSMClient, GetParameterCommand, PutParameterCommand, DeleteParameterCommand } from '@aws-sdk/client-ssm';
import dotenv from 'dotenv';
dotenv.config();

const AWS_REGION = process.env.AWS_REGION ?? (() => {
    throw new Error("Missing AWS_REGION environment variable");
  })();

const STAGE = process.env.STAGE || 'deployment';

async function getDbUrl() {
  const DATABASE_URL_SSM_PARAM = `/serverless-framework/${STAGE}/database-url`;

    const ssmClient = new SSMClient({ region: AWS_REGION });
    const paramStoreData = {
        Name: DATABASE_URL_SSM_PARAM,
        WithDecryption: true,
    }
    const command = new GetParameterCommand(paramStoreData);
    try {
        const result = await ssmClient.send(command);
        return result.Parameter.Value;
      } catch (err) {
        console.error("SSM Error:", err.name, err.message);
        throw err;
      }
}

async function putDatabaseUrl(stage, dbUrlValue) {
  const paramStage = stage ? stage : 'dev';
  if(paramStage === "prod") {
    return
  }
  if(!dbUrlValue) {
    return
  }
  const DATABASE_URL_SSM_PARAM = `/serverless-framework/${paramStage}/database-url`;
    const ssmClient = new SSMClient({ region: AWS_REGION });
    const paramStoreData = {
        Name: DATABASE_URL_SSM_PARAM,
        Value: dbUrlValue,
        Type: "SecureString",
        Overwrite: true,
    }
    const command = new PutParameterCommand(paramStoreData);
    try {
        const result = await ssmClient.send(command);
        console.log("SSM result:", result?.Parameter?.Value?.slice(0, 20) + "...");
        return result;
      } catch (err) {
        console.error("SSM Error:", err.name, err.message);
        throw err;
      }
}

export { getDbUrl, putDatabaseUrl };
