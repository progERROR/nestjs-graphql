import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getRoutes(host: string = `http://localhost:3000`): object {
    return {
      host: `${host}/`,
      'swagger-api': `${host}/api/`,
      'log-file': `${host}/logs/`,
    };
  }
}
