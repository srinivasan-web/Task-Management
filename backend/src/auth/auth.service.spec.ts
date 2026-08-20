import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const users = { findByEmail: jest.fn(), create: jest.fn() };
  const jwt = { sign: jest.fn().mockReturnValue('signed-token') };
  const service = new AuthService(users as any, jwt as any);
  beforeEach(() => jest.clearAllMocks());

  it('registers a normalized email and returns no password data', async () => {
    users.findByEmail.mockResolvedValue(null); users.create.mockResolvedValue({ id: 'user-1', name: 'Asha', email: 'asha@example.com', createdAt: new Date(), updatedAt: new Date() });
    const result = await service.register(' Asha ', ' ASHA@EXAMPLE.COM ', 'SecurePass123!');
    expect(users.create).toHaveBeenCalledWith('Asha', 'asha@example.com', expect.any(String));
    expect(result.data.user).not.toHaveProperty('password'); expect(result.data.user).not.toHaveProperty('passwordHash'); expect(result.data.accessToken).toBe('signed-token'); expect(jwt.sign).toHaveBeenCalledWith({ sub: 'user-1' });
  });

  it('rejects duplicate email', async () => { users.findByEmail.mockResolvedValue({ id: 'user-1' }); await expect(service.register('Asha', 'asha@example.com', 'SecurePass123!')).rejects.toBeInstanceOf(ConflictException); });
  it('rejects invalid credentials without revealing which field failed', async () => { users.findByEmail.mockResolvedValue(null); await expect(service.login('missing@example.com', 'wrong')).rejects.toBeInstanceOf(UnauthorizedException); });
});
