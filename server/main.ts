import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NextModule } from '@nestpress/next';

async function bootstrap() {
	const server = await NestFactory.create(AppModule);
	server.useGlobalPipes(new ValidationPipe());
	server.get(NextModule).prepare()
		.then(() => server.listen(process.env.PORT || 3000))
		.catch(error => console.log(error));
}
bootstrap().then(() =>  console.log('Nest is running on port 3000'));
