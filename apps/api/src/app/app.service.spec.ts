import { Test } from '@nestjs/testing';

import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService]
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('getData', () => {
    it('should return the default todos', () => {
      const todos = [{ title: 'Todo 1' }, { title: 'Todo 2' }];
      expect(service.getData()).toEqual(todos);
    });
  });
});
