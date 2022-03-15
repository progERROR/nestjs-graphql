import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get('/')
  getStartUpRoutes(): object {
    console.log('PORT:', this.configService.get('PORT'));

    return this.appService.getRoutes(this.configService.get('HOST'));
  }
}
