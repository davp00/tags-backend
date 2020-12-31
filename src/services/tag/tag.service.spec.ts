import { Test, TestingModule } from '@nestjs/testing';
import { TagService } from './tag.service';
import { AppModule } from '../../app.module';
import { GqlModule } from '../../gql/gql.module';
import { AutoIncrementModel, TagModel } from '../../models';
import { MongooseModule } from '@nestjs/mongoose';
import { AutoIncrementService } from '../autoincrement/autoincrement.service';
import { TagListPaginated } from '../../gql/types/taglist.paginated';
import { PaginationOptions } from '../../gql/types/pagination.options';
import { getModelToken } from '@nestjs/mongoose';
import { Tag } from '../../models/tag';
import { Model } from 'mongoose';

describe('TagService', () => {
  let service: TagService;
  let tagModel;

  const randomId = '551137c2f9e1fac808a5f572';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        GqlModule,
        MongooseModule.forFeature([AutoIncrementModel, TagModel]),
      ],
      providers: [TagService, AutoIncrementService],
    }).compile();

    service = module.get<TagService>(TagService);
    tagModel = module.get<Model<Tag>>(getModelToken(TagModel.name));
  });

  it('should be defined', () => {
    return expect(service).toBeDefined();
  });

  describe('createTag', function () {
    it('should return new tag', async function (done) {
      const tagName = 'TEST';
      const result = await service.createTag(tagName);
      expect(result).toBeDefined();
      expect(result.name).toBe(tagName);
      expect(result._pid).toEqual(expect.any(Number));
      expect(result.color).toMatch(/^#(?:[0-9a-fA-F]{3}){1,2}$/);
      done();
    });
    it('should return a null tag', async function () {
      const result = await service.createTag('');
      expect(result).toBeNull();
    });
  });

  describe('getTags', function () {
    async function getTagsTest(limit) {
      const pOptions: PaginationOptions = {
        page: 1,
        limit,
      } as PaginationOptions;
      const result: TagListPaginated = await service.getTags(pOptions);

      expect(result).toBeDefined();
      expect(result.tags.length).toBeLessThanOrEqual(pOptions.limit);
    }
    it('should return a Tag list with a limit of 1 ', async function () {
      await getTagsTest(1);
    });
    it('should return a Tag list with a limit of 10 ', async function () {
      await getTagsTest(10);
    });
  });

  describe('editTag', function () {
    const tagNewName = 'TEST_NEW';
    it('should return true on tag edited', async function () {
      let tag: Tag = await tagModel.findOne().sort({ createdAt: -1 });
      const result = await service.editTag(tag.id, tagNewName);

      tag = await tagModel.findById(tag.id);
      expect(result).toBe(true);
      expect(tag.name).toEqual(tagNewName);
    });
    it('should return false on tag not found', async function () {
      const result = await service.editTag(randomId, tagNewName);

      expect(result).toBe(false);
    });
  });

  describe('deleteTag', function () {
    it('should return true on tag deleted', async function () {
      let tag: Tag = await tagModel.findOne().sort({ createdAt: -1 });
      const result = await service.deleteTag(tag.id);

      tag = await tagModel.findById(tag.id);
      expect(result).toBe(true);
      expect(tag).toBeNull();
    });

    it('should return true on tag not found', async function () {
      const result = await service.deleteTag(randomId);
      expect(result).toBe(false);
    });
  });

  describe('Empty list exception', function () {
    beforeEach(async () => {
      await tagModel.deleteMany({});
    });
    it('should return an empty list', async function () {
      const pOptions: PaginationOptions = {
        page: 1,
        limit: 10,
      } as PaginationOptions;
      const result: TagListPaginated = await service.getTags(pOptions);

      expect(result).toBeDefined();
      expect(result.tags).toHaveLength(0);
      expect(result.pages).toEqual(0);
      expect(result.total).toEqual(0);
    });
  });
});
