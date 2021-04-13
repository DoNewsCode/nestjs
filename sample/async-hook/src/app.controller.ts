/**
 * Created by Rain on 2020/7/17
 */
import { Controller, Get, Post, UseInterceptors } from '@nestjs/common';

import { TracingHttpInterceptor } from '@donews/nestjs-tracing';

import { AppService } from './app.service';

@Controller('/app')
@UseInterceptors(TracingHttpInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async get(): Promise<any> {
    return await this.appService.get();
  }

  @Post()
  async post(): Promise<any> {
    return await this.appService.get();
  }
}
