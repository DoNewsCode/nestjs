/**
 * Created by Rain on 2020/7/17
 */
import { Controller, Get, Post } from '@nestjs/common';

import { AsyncContext } from '@donews/nestjs-tracing';

import { AppService } from './app.service';

@Controller('/')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly asyncContext: AsyncContext,
  ) {}

  @Get('/app')
  async get(): Promise<any> {
    this.asyncContext.set('tracing', { controller: 'get' });
    return await this.appService.get();
  }

  @Post('/')
  async post(): Promise<any> {
    return await this.appService.get();
  }
}
