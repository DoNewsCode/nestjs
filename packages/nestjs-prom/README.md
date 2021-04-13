# nest prometheus module

取消多 register 设计，没啥必要，感觉不到多个 register 的用处和意义，
并且不同 register 同 name 合并时，会直接 throw 没啥意义，以后由更加完善的需求再研究吧

## 描述

## Install

```bash
$ npm i @donews/nestjs-prom prom-client
```

## Quick Start

假定一个目录结构

```
/root
    /src
        app.module.ts
```

### 1. 模块导入

```typescript
import { LoggerModule } from '@donews/nestjs-prom';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    PromModule.forRoot(
      {
        withDefaultsMetrics: false,
      },
      [
        {
          type: MetricType.Counter,
          configuration: {
            name: 'my_counter',
            help: 'my_counter a simple counter',
          },
        },
        {
          type: MetricType.Gauge,
          configuration: {
            name: 'my_gauge',
            help: 'my_gauge a simple gauge',
          },
        },
        {
          type: MetricType.Histogram,
          configuration: {
            name: 'my_histogram',
            help: 'my_histogram a simple histogram',
          },
        },
        {
          type: MetricType.Summary,
          configuration: {
            name: 'my_summary',
            help: 'my_summary a simple summary',
          },
        },
      ],
    ),
  ],
})
export class AppModule {}
```

### 2. 增加 asynchronous provider

```typescript
@Module({
  imports: [
    PromModule.forRootAsync(
      {
        useFactory(configService: ConfigService) {
          return {
            withDefaultsMetrics: configService.get(false),
          };
        },
        inject: [ConfigService],
        imports: [ConfigModule],
      },
      [
        {
          type: MetricType.Counter,
          configuration: {
            name: 'my_counter',
            help: 'my_counter a simple counter',
          },
        },
        {
          type: MetricType.Gauge,
          configuration: {
            name: 'my_gauge',
            help: 'my_gauge a simple gauge',
          },
        },
        {
          type: MetricType.Histogram,
          configuration: {
            name: 'my_histogram',
            help: 'my_histogram a simple histogram',
          },
        },
        {
          type: MetricType.Summary,
          configuration: {
            name: 'my_summary',
            help: 'my_summary a simple summary',
          },
        },
      ],
    ),
  ],
})
export class AppModule {}
```

### 3. 使用

```typescript
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
class TestService {
  constructor(
    @Inject('my_counter')
    private readonly counter: Counter<string>,
  ) {}

  say() {
    this.counter.inr();
  }
}
```

## License

Nest is [MIT licensed](LICENSE).
