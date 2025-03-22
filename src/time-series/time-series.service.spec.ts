import { Test, TestingModule } from '@nestjs/testing';
import { TimeSeriesService } from './time-series.service';

describe('TimeSeriesService', () => {
  let service: TimeSeriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeSeriesService],
    }).compile();

    service = module.get<TimeSeriesService>(TimeSeriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
