import { PrismaClientExceptionFilter } from '.';

describe('PrismaClientExceptionFilter', () => {
  it('should be defined', () => {
    expect(new PrismaClientExceptionFilter()).toBeDefined();
  });
});
