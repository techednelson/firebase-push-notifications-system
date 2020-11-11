import { Controller, Get, Req, Res } from '@nestjs/common';
import { NextService } from '@nestpress/next';
import { IncomingMessage, ServerResponse } from 'http';
import { AuthService } from './auth/auth.service';

@Controller()
export class FcmAdminClientController {
  constructor(
    private readonly authService: AuthService,
    private readonly next: NextService
  ) {
  }
  
  @Get()
  async showLoginPage(@Req() req: IncomingMessage, @Res() res: ServerResponse) {
    const url = await this.authService.isAdminUser() ? 'sign-in' : 'sign-up';
    await this.next.render(`/${url}`, req, res);
  }
  
  @Get('/list-notifications')
  async showListNotificationsPage(@Req() req: IncomingMessage, @Res() res: ServerResponse): Promise<void> {
    console.log(req.headers);
    await this.next.render('/list-notifications', req, res);
  }
  
  @Get('/list-subscribers')
  async showListSubscribersPage(@Req() req: IncomingMessage, @Res() res: ServerResponse): Promise<void> {
    await this.next.render('/list-subscribers', req, res);
  }
  
  @Get('/compose-notification')
  async showNotificationsPage(@Req() req: IncomingMessage, @Res() res: ServerResponse): Promise<void> {
    await this.next.render('/compose-notification', req, res);
  }
}
