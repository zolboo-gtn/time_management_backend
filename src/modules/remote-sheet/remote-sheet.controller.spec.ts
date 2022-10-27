import { Test, TestingModule } from '@nestjs/testing';
import { RemoteSheetController } from './remote-sheet.controller';

describe('RemoteSheetController', () => {
  let controller: RemoteSheetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RemoteSheetController],
    }).compile();

    controller = module.get<RemoteSheetController>(RemoteSheetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
