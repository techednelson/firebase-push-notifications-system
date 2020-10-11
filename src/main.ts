import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const server = await NestFactory.create(AppModule);
	server.useGlobalPipes(new ValidationPipe());
	await server.listen(process.env.PORT || 3000);
}

bootstrap()
	.then(() => console.log('Nest is running on port 3000'))
	.catch(error => console.log(error));
