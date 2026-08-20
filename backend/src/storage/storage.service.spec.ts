import { BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  const config = { get: jest.fn() };
  const service = new StorageService(config as any);
  const file = { buffer: Buffer.from('file'), originalname: 'inspection reference.png', mimetype: 'image/png', size: 4 };
  beforeEach(() => { jest.clearAllMocks(); config.get.mockImplementation((key: string, fallback?: string) => ({ MAX_UPLOAD_BYTES: '10', ALLOWED_UPLOAD_MIME_TYPES: 'image/png' }[key] ?? fallback)); });
  it('rejects unsupported attachment types before contacting a provider', async () => { await expect(service.uploadTaskAttachment({ ...file, mimetype: 'image/svg+xml' })).rejects.toBeInstanceOf(BadRequestException); });
  it('rejects oversized files before contacting a provider', async () => { await expect(service.uploadTaskAttachment({ ...file, size: 11 })).rejects.toBeInstanceOf(BadRequestException); });
  it('fails safely when Cloudinary is not configured', async () => { await expect(service.uploadTaskAttachment(file)).rejects.toBeInstanceOf(ServiceUnavailableException); });
});
