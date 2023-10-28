import dotenv from 'dotenv';
dotenv.config();
import SecretsManager from "./secretManager";



const secretManager = new SecretsManager()

secretManager.getSecrets().then(() => {
  console.log(process.env.DEPLOY_HOST_PORT, '=-=-=-=-')
  // process.env.DEPLOY_HOST_PORT = '3000';
  // console.log(process.env)

  const app = require("./app");
  app.listen(process.env.DEPLOY_HOST_PORT, (): void => {
    console.log(
      `Server running on http://localhost:${process.env.DEPLOY_HOST_PORT}`
    );
  });
})