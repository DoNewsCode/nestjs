/**
 * created at by Rain 2020/7/18
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export class GrpcService {
  getService(): Promise<string> {
    return new Promise<string>((resolve) => {
      const num = 1000 * Math.random();
      const str = num + ':grpcService';
      setTimeout(() => {
        resolve(str);
      }, num);
    });
  }
}
