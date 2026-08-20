import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';

const task = { id: 'task-a', title: 'Private task', description: null, status: 'TODO', priority: 'HIGH', dueDate: null, location: 'Chennai', attachmentUrl: null, userId: 'user-a', createdAt: new Date(), updatedAt: new Date() };
describe('TasksService security and lifecycle', () => {
  const prisma = { task: { create: jest.fn(), findFirst: jest.fn(), findMany: jest.fn(), count: jest.fn(), updateMany: jest.fn(), deleteMany: jest.fn() }, attachment: { create: jest.fn(), delete: jest.fn() }, $transaction: jest.fn() };
  const users = { findById: jest.fn() }; const email = { sendTaskCreated: jest.fn(), sendTaskCompleted: jest.fn() }; const storage = { uploadTaskAttachment: jest.fn() }; const weather = { current: jest.fn() };
  const service = new TasksService(prisma as any, users as any, email as any, storage as any, weather as any);
  beforeEach(() => jest.clearAllMocks());

  it('assigns ownership from the authenticated user on create', async () => { prisma.task.create.mockResolvedValue(task); users.findById.mockResolvedValue({ email: 'a@example.com' }); await service.create('user-a', { title: 'Private task' } as any); expect(prisma.task.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ userId: 'user-a' }) })); expect(email.sendTaskCreated).toHaveBeenCalled(); });
  it('does not reveal a foreign task', async () => { prisma.task.findFirst.mockResolvedValue(null); await expect(service.get('user-b', 'task-a')).rejects.toBeInstanceOf(NotFoundException); expect(prisma.task.findFirst).toHaveBeenCalledWith({ where: { id: 'task-a', userId: 'user-b' } }); });
  it('scopes update and delete by task and owner', async () => { prisma.task.updateMany.mockResolvedValue({ count: 0 }); prisma.task.deleteMany.mockResolvedValue({ count: 0 }); await expect(service.update('user-b', 'task-a', { title: 'attack' })).rejects.toBeInstanceOf(NotFoundException); await expect(service.remove('user-b', 'task-a')).rejects.toBeInstanceOf(NotFoundException); expect(prisma.task.updateMany).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'task-a', userId: 'user-b' } })); expect(prisma.task.deleteMany).toHaveBeenCalledWith({ where: { id: 'task-a', userId: 'user-b' } }); });
  it('sends completion email only on a real transition to DONE', async () => { prisma.task.updateMany.mockResolvedValueOnce({ count: 1 }); prisma.task.findFirst.mockResolvedValue(task); users.findById.mockResolvedValue({ email: 'a@example.com' }); await service.update('user-a', 'task-a', { status: 'DONE' } as any); expect(email.sendTaskCompleted).toHaveBeenCalledTimes(1); expect(prisma.task.updateMany).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'task-a', userId: 'user-a', status: { not: 'DONE' } } })); });
});
