/**
 * Created by Rain on 2020/7/21
 */
import { TracingConfig, TracingOptions } from 'jaeger-client';

import { TracingModuleOptions } from '..';

export function formatTracingModuleOptions(
  tracingModuleOptions: TracingModuleOptions,
): { tracingConfig: TracingConfig; tracingOption: TracingOptions } {
  const { tracingConfig, tracingOption } = tracingModuleOptions;

  if (tracingOption?.contextKey) {
    tracingOption.contextKey = tracingOption.contextKey?.toLowerCase();
  }
  if (tracingOption?.baggagePrefix) {
    tracingOption.baggagePrefix = tracingOption.baggagePrefix?.toLowerCase();
  }
  return { tracingConfig, tracingOption };
}
