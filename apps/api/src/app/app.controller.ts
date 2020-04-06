import { Controller, Get, Post, Req, Request } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('todos')
  getData(@Req() req: Request) {
    if (typeof req !== 'undefined' && typeof req['user'] !== 'undefined') {
      console.log('req.user.name',req['user'].name);
    }
    return this.appService.getData();
  }

  @Post('addTodo')
  addTodo() {
    return this.appService.addTodo();
  }
}
