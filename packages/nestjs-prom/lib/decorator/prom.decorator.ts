/**
 * Created by Rain on 2020/6/18
 */
import { Counter, CounterConfiguration } from 'prom-client';

export function PromMethodCounter(
  counterConfig: CounterConfiguration<any> = { name: '', help: '' },
): MethodDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (
    target: Record<string, unknown>,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const className = target.constructor.name;

    counterConfig.name = `app_${className}_${propertyKey.toString()}_calls_total`;
    counterConfig.help = `app_${className}#${propertyKey.toString()} called total`;
    const counterMetric = new Counter(counterConfig);

    const methodFunc = descriptor.value;
    descriptor.value = function (...args) {
      counterMetric.inc(1);
      return methodFunc.apply(this, args);
    };
  };
}
