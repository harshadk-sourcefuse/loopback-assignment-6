import { LoopbackAssignment6Application } from '../..';
import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';
import { testDbConfig } from '../database.helper';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });

  const app = new LoopbackAssignment6Application({
    rest: restConfig,
  });

  await app.boot();

  app.bind('datasources.config.memoryDB').to(testDbConfig);

  await app.start();

  const client = createRestAppClient(app);
  return { app, client };
}

export interface AppWithClient {
  app: LoopbackAssignment6Application;
  client: Client;
}
