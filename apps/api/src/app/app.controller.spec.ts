import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService]
    }).compile();
  });

  describe('getData', () => {
    it('should return the defaul todos', () => {
      const appController = app.get<AppController>(AppController);
      const todos = [{ title: 'Todo 1' }, { title: 'Todo 2' }];
      expect(appController.getData()).toEqual(todos);
    });
  });
});
