import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import * as joiconfig from './configs/envconfig';
import * as ormconfig from './configs/ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ...joiconfig,
    }),
    TypeOrmModule.forRoot(ormconfig),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
