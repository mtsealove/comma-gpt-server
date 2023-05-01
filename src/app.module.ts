import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Info } from './info.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      synchronize: true,
      database: process.env.DB_NAME,
      entities: [
        __dirname + '/**/*.entity.{js,ts}',
        __dirname + '/**/**/*.entity.{js,ts}',
      ],
    }),
    TypeOrmModule.forFeature([Info]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
