import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateTaskDto, ListTasksDto, UpdateTaskDto } from './dto/task.dto';
import { TasksService } from './tasks.service';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}
  @Post() create(@CurrentUser() user: { userId: string }, @Body() dto: CreateTaskDto) { return this.tasks.create(user.userId, dto); }
  @Get() list(@CurrentUser() user: { userId: string }, @Query() query: ListTasksDto) { return this.tasks.list(user.userId, query); }
  @Get(':id') get(@CurrentUser() user: { userId: string }, @Param('id') id: string) { return this.tasks.get(user.userId, id); }
  @Patch(':id') update(@CurrentUser() user: { userId: string }, @Param('id') id: string, @Body() dto: UpdateTaskDto) { return this.tasks.update(user.userId, id, dto); }
  @Delete(':id') @HttpCode(204) remove(@CurrentUser() user: { userId: string }, @Param('id') id: string) { return this.tasks.remove(user.userId, id); }
  @Post(':id/attachments') @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5_242_880, files: 1 } })) upload(@CurrentUser() user: { userId: string }, @Param('id') id: string, @UploadedFile() file: any) { return this.tasks.uploadAttachment(user.userId, id, file); }
  @Get(':id/weather') weather(@CurrentUser() user: { userId: string }, @Param('id') id: string) { return this.tasks.getWeather(user.userId, id); }
}
