import { Injectable } from '@nestjs/common';

import { LOGGER_TYPE } from '../../lib';

@Injectable()
export class ConfigService {
  getJson(): LOGGER_TYPE {
    return LOGGER_TYPE.JSON_MODEL;
  }
  getPlain(): LOGGER_TYPE {
    return LOGGER_TYPE.PLAIN_MODEL;
  }
}
