import { Controller, Get, Render } from '@nestjs/common';

@Controller('fcm-admin-client')
export class FcmAdminClientController {
  
  @Get()
	@Render('Index')
	getIndex(): void  { }
	
	@Get()
	@Render('Dashboard')
	getDashboard(): void  { }
	
}
