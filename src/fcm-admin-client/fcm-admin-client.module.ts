import { Module } from '@nestjs/common';
import { FcmAdminClientController } from './fcm-admin-client.controller';

@Module({
  providers: [],
  controllers: [FcmAdminClientController]
})
export class FcmAdminClientModule {}
