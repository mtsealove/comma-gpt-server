import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getAnswer(@Query('question') question: string) {
    return this.appService.getAnswer(question);
  }
}
