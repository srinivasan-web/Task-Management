import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { EmailService } from '../email/email.service';
import { StorageService } from '../storage/storage.service';
import { UsersService } from '../users/users.service';
import { CurrentWeather, WeatherService } from '../weather/weather.service';
import { CreateTaskDto, ListTasksDto, UpdateTaskDto } from './dto/task.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private readonly prisma: PrismaService, private readonly users: UsersService, private readonly email: EmailService, private readonly storage: StorageService, private readonly weather: WeatherService) {}

  async create(userId: string, dto: CreateTaskDto) {
    const [task, user] = await Promise.all([
      this.prisma.task.create({ data: { ...dto, dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined, userId } }),
      this.users.findById(userId),
    ]);
    if (user) this.deliverEmail(this.email.sendTaskCreated(user.email, task), 'Task created email');
    return { data: task };
  }

  async list(userId: string, query: ListTasksDto) {
    if (query.dueFrom && query.dueTo && new Date(query.dueFrom) > new Date(query.dueTo)) {
      throw new BadRequestException('dueFrom must not be after dueTo.');
    }
    const where: Prisma.TaskWhereInput = {
      userId,
      status: query.status,
      priority: query.priority,
      dueDate: query.dueFrom || query.dueTo ? { gte: query.dueFrom ? new Date(query.dueFrom) : undefined, lte: query.dueTo ? new Date(query.dueTo) : undefined } : undefined,
    };
    const [data, totalItems] = await this.prisma.$transaction([
      this.prisma.task.findMany({ where, skip: (query.page - 1) * query.limit, take: query.limit, orderBy: { [query.sortBy]: query.sortOrder } }),
      this.prisma.task.count({ where }),
    ]);
    return { data, meta: { page: query.page, limit: query.limit, totalItems, totalPages: Math.ceil(totalItems / query.limit) } };
  }

  async get(userId: string, id: string) {
    const task = await this.prisma.task.findFirst({ where: { id, userId } });
    if (!task) throw new NotFoundException('Task not found.');
    return { data: task };
  }

  async update(userId: string, id: string, dto: UpdateTaskDto) {
    const changes = { ...dto, dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined };

    if (dto.status === 'DONE') {
      const transitioned = await this.prisma.task.updateMany({ where: { id, userId, status: { not: 'DONE' } }, data: changes });
      if (transitioned.count === 1) {
        const [result, user] = await Promise.all([this.get(userId, id), this.users.findById(userId)]);
        if (user) this.deliverEmail(this.email.sendTaskCompleted(user.email, result.data), 'Task completed email');
        return result;
      }
    }

    const updated = await this.prisma.task.updateMany({ where: { id, userId }, data: changes });
    if (updated.count === 0) throw new NotFoundException('Task not found.');
    return this.get(userId, id);
  }

  async remove(userId: string, id: string) {
    const deleted = await this.prisma.task.deleteMany({ where: { id, userId } });
    if (deleted.count === 0) throw new NotFoundException('Task not found.');
  }

  async uploadAttachment(userId: string, id: string, file: { buffer: Buffer; originalname: string; mimetype: string; size: number }) {
    await this.get(userId, id);
    const stored = await this.storage.uploadTaskAttachment(file);
    const attachment = await this.prisma.attachment.create({ data: { taskId: id, ...stored } });
    const linked = await this.prisma.task.updateMany({ where: { id, userId }, data: { attachmentUrl: stored.url } });
    if (linked.count === 0) {
      await this.prisma.attachment.delete({ where: { id: attachment.id } });
      throw new NotFoundException('Task not found.');
    }
    return { data: attachment };
  }

  async getWeather(userId: string, id: string): Promise<{ data: CurrentWeather }> {
    const task = await this.get(userId, id);
    if (!task.data.location) throw new BadRequestException('Task location is required for weather lookup.');
    return { data: await this.weather.current(task.data.location) };
  }

  private deliverEmail(delivery: Promise<void> | void, label: string) {
    void Promise.resolve(delivery).catch((error) => this.logger.error(`${label} failed`, error instanceof Error ? error.stack : undefined));
  }
}
