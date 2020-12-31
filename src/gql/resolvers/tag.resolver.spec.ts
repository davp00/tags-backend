import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { GqlModule } from '../gql.module';
import { AutoIncrementModel, TagModel } from '../../models';
import { TagService } from '../../services/tag/tag.service';
import { AutoIncrementService } from '../../services/autoincrement/autoincrement.service';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Tag } from '../../models/tag';
import { Model } from 'mongoose';
import { TagResolver } from './tag.resolver';
import { PaginationOptions } from '../types/pagination.options';

describe('TagResolver', () => {
  let tagModel;
  let resolver: TagResolver;
  let tagService: TagService;

  beforeEach(async function () {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        GqlModule,
        MongooseModule.forFeature([AutoIncrementModel, TagModel]),
      ],
      providers: [TagService, AutoIncrementService, TagResolver],
    }).compile();

    tagModel = module.get<Model<Tag>>(getModelToken(TagModel.name));
    resolver = module.get<TagResolver>(TagResolver);
    tagService = module.get<TagService>(TagService);
  });

  it('should be defined', () => {
    return expect(resolver).toBeDefined();
  });

  describe('createTag Graphql entry', function () {
    it('should return true on created tag', async function () {
      const tagName = 'TEST_GRAPHQL';
      expect(await resolver.createTag(tagName)).toBe(true);
    });
  });

  describe('tagList Graphql entry', function () {
    it('should return tag list with limit 10', async function () {
      const pOptions: PaginationOptions = { limit: 10, page: 1 };
      expect(await resolver.tagList(pOptions)).toEqual(
        await tagService.getTags(pOptions),
      );
    });
  });

  describe('editTag Graphql entry', function () {
    it('should return true on tag edited', async function () {
      const tagName = 'NEW_NAME_GRAPHQL';
      const tag: Tag = await tagModel.findOne().sort({ createdAt: -1 });
      expect(await resolver.editTag(tag.id, tagName)).toBe(true);
    });
  });

  describe('deleteTag Graphql entry', function () {
    it('should return true on tag deleted', async function () {
      const tag: Tag = await tagModel.findOne().sort({ createdAt: -1 });
      expect(await resolver.deleteTag(tag.id)).toBe(true);
    });
  });

  describe('updateTagList Subscription', function () {
    it('should return subscription listener', function () {
      expect(resolver.updateTagList()).toBeDefined();
    });
  });
});
