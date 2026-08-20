import { Module } from '@nestjs/common';
import { EmailModule } from '../email/email.module';
import { StorageModule } from '../storage/storage.module';
import { UsersModule } from '../users/users.module';
import { WeatherModule } from '../weather/weather.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({ imports: [EmailModule, StorageModule, UsersModule, WeatherModule], controllers: [TasksController], providers: [TasksService] })
export class TasksModule {}
