import { Test, TestingModule } from '@nestjs/testing';
import { AutoIncrementService } from './autoincrement.service';
import { GqlModule } from '../../gql/gql.module';
import { AppModule } from '../../app.module';
import { AutoIncrementModel } from '../../models';
import { MongooseModule } from '@nestjs/mongoose';

const TEST_MODULE = 'Test';

describe('AutoincrementService', () => {
  let service: AutoIncrementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        GqlModule,
        MongooseModule.forFeature([AutoIncrementModel]),
      ],
      providers: [AutoIncrementService],
    }).compile();

    service = module.get<AutoIncrementService>(AutoIncrementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSequence', () => {
    it('should return next sequence', async function () {
      const currentSequence = await service.getSequence(TEST_MODULE);
      expect(await service.getSequence(TEST_MODULE)).toEqual(
        currentSequence + 1,
      );
    });
  });

  beforeAll((done) => {
    done();
  });
});
