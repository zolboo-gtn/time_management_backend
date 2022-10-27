import { Test, TestingModule } from '@nestjs/testing';
import { RemoteSheetService } from './remote-sheet.service';

describe('RemoteSheetService', () => {
  let service: RemoteSheetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RemoteSheetService],
    }).compile();

    service = module.get<RemoteSheetService>(RemoteSheetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
