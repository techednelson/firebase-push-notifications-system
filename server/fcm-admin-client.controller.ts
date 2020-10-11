import { Controller, Get, Req, Res } from '@nestjs/common';
import { NextService } from '@nestpress/next';
import { IncomingMessage, ServerResponse } from 'http';

@Controller()
export class FcmAdminClientController {
 
	constructor(
    private readonly next: NextService,
  ) {}
  
  @Get()
  public async showHome(@Req() req: IncomingMessage, @Res() res: ServerResponse) {
    // this will render `pages/index.tsx`!
    await this.next.render('/index', req, res);
  }
	
	// @Get()
	// async showDashboardPage(@Req() req: IncomingMessage, @Res() res: ServerResponse): Promise<void>  {
  //   await this.next.render('/dashboard', req, res);
	// }
	
}
