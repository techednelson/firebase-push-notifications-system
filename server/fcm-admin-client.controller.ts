import { Controller, Get, Req, Res } from '@nestjs/common';
import { NextService } from '@nestpress/next';
import { IncomingMessage, ServerResponse } from 'http';

@Controller()
export class FcmAdminClientController {
  constructor(private readonly next: NextService) {
  }
  
  @Get()
  async showIndexPage(@Req() req: IncomingMessage, @Res() res: ServerResponse) {
    // this will render `pages/index.tsx`!
    await this.next.render('/index', req, res);
  }
  
  @Get('/list-notifications')
  async showListNotificationsPage(
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
  ): Promise<void> {
    await this.next.render('/list-notifications', req, res);
  }
  
  @Get('/notification')
  async showNotificationsPage(
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
  ): Promise<void> {
    await this.next.render('/notification', req, res);
  }
  
  @Get('/list-subscribers')
  async showListSubscribersPage(
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
  ): Promise<void> {
    await this.next.render('/list-subscribers', req, res);
  }
}
