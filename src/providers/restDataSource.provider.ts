
import {getService} from '@loopback/service-proxy';
import {inject, Provider} from '@loopback/core';
import { UserApiService } from '../types';
import { juggler } from '@loopback/repository';

export class RestDataSourceProvider implements Provider<UserApiService> {
  constructor(
    @inject('datasources.rest')
    protected restDataSource: juggler.DataSource,
  ) {}

  value(): Promise<UserApiService> {
    return getService(this.restDataSource);
  }
}