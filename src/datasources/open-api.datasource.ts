import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'openApi',
  connector: 'openapi',
  spec: 'http://localhost:8000/openapi.json',
  transformResponse : (res:any, operationSpec:any)=>{
    if (res.status < 400) {
      return res.body;
    }
    const err:any = new Error(`${res.status} ${res.statusText}`);
    err.details = res;
    throw err;
  }
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class OpenApiDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'openApi';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.OpenApi', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
