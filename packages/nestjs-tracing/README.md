# nest open tracing

## 描述

nest http tracing 工具

## 待支持

1. websocket

## install

```shell
$ npm i @donews/nestjs-tracing jaeger-client opentracing
$ npm i -D @types/jaeger-client
```

## 参数解释

- tracingConfig&tracingOption: [jaeger-client](https://github.com/jaegertracing/jaeger-client-node)
- tracingOption 增加 contextKey，baggagePrefix，自定义 tracingId Key 字段，baggage 前缀字段

## quick start

### 1. 同步模块导入

```typescript
import { TracingModule } from '@donews/nestjs-tracing';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TracingModule.forRoot({
      tracingConfig: {
        serviceName: 'tracing-service',
        sampler: {
          param: 1,
          type: 'const',
        },
      },
      tracingOption: {
        tags: {},
      },
    }),
  ],
})
export class AppModule {}
```

### 2. 异步模块导入

```typescript
import { TracingModule, TracingModuleOptions } from '@donews/nestjs-tracing';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TracingModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          tracingConfig: {
            serviceName: configService.get<string>('APP_NAME'),
            sampler: {
              param: 1,
              type: 'const',
            },
          },
          tracingOption: {
            tags: {},
          },
        } as TracingModuleOptions;
      },
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### 3. http server receive request interceptor

HttpModule 上的 HttpService 设置 interceptors

```typescript
import { HttpServiceInterceptors } from '@donews/nestjs-tracing/lib/http-service.interceptors';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({})
export class AdModule implements OnApplicationBootstrap {
  constructor(private readonly httpService: HttpService) {}
  /**
   * 设置axios拦截器，增加tracing信息
   */
  onApplicationBootstrap(): void {
    this.httpService.axiosRef.interceptors.request.use(
      ...HttpServiceInterceptors.interceptRequest(),
    );
    this.httpService.axiosRef.interceptors.response.use(
      ...HttpServiceInterceptors.interceptResponse(),
    );
  }
}
```

http-request-tracing 会自动读取 header 和 query 上的 tracingId，如果自定义了 tracingId key 值，请在模块导入 tracingOption 进行修改

```typescript
import { TracingHttpInterceptor } from '@donews/nestjs-tracing';
import { UseInterceptors } from '@nestjs/common';

@UseInterceptors(TracingHttpInterceptor)
export class AppController {}
```

### 4. grpc client request interceptor

```typescript
import { tracingGrpcInterceptor } from '@donews/nestjs-tracing';
import { ClientProxyFactory } from '@nestjs/microservices';
import { FactoryProvider } from '@nestjs/common';

export const RawGrpcProvider: FactoryProvider = {
  provide: 'RAW_SERVICE',
  useFactory: () => {
    return ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        channelOptions: {
          interceptors: [tracingGrpcInterceptor] as any,
        },
      },
    });
  },
};
```

[online example](https://github.com/DoNewsCode/nestjs-tracing/blob/master/sample/async-hook/proto/raw.service.ts)

## License

Nest is [MIT licensed](LICENSE).
