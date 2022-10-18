
import {getService} from '@loopback/service-proxy';
import {inject, Provider} from '@loopback/core';
import { UserApiService } from '../types';
import { juggler } from '@loopback/repository';

export class OpenApiDataSourceProvider implements Provider<UserApiService> {
  constructor(
    @inject('datasources.openApi')
    protected openApiDataSource: juggler.DataSource,
  ) {}

  value(): Promise<UserApiService> {
    return getService(this.openApiDataSource);
  }
}