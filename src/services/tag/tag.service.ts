import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag, TAG_MODEL_NAME } from '../../models/tag';
import { AutoIncrementService } from '../autoincrement/autoincrement.service';
import {
  SUBSCRIPTION_PROVIDER,
  UPDATE_LIST_EVENT,
} from '../../gql/constants/subscriptions';
import { PubSub } from 'graphql-subscriptions';
import { ActionE } from '../../gql/enums';
import { TagUpdate } from '../../gql/types/tag.uptade';
import { PaginationOptions } from '../../gql/types/pagination.options';
import { TagListPaginated } from '../../gql/types/taglist.paginated';

/**
 * Service in charge of Tag Document actions.
 */
@Injectable()
export class TagService {
  /**
   * Constructor to which the corresponding dependencies are injected by the different modules for the correct functioning of the service
   * @param tagModel Mongoose model for different {@linkcode Tag} queries.
   * @param autoIncrementService Injection service to handle the auto-increment strategy
   * @param pubSub Class that allows the communication of events to graphql subscriptions
   */
  constructor(
    @InjectModel(TAG_MODEL_NAME) private readonly tagModel: Model<Tag>,
    private readonly autoIncrementService: AutoIncrementService,
    @Inject(SUBSCRIPTION_PROVIDER) private readonly pubSub: PubSub,
  ) {}

  /**
   * Hexadecimal characters
   */
  private static readonly hexLetters = '0123456789ABCDEF';

  /**
   * Gets a list of paginated tags.
   * @param paginationOptions paging options
   * @returns Tag list paginated
   */
  public async getTags(
    paginationOptions: PaginationOptions,
  ): Promise<TagListPaginated> {
    const sort = { _pid: -1 };
    const { page, limit } = paginationOptions;

    try {
      const res = await this.tagModel
        .aggregate([
          {
            $facet: {
              paginatedResult: [
                { $sort: sort },
                { $skip: (page - 1) * limit },
                { $limit: limit },
              ],
              count: [{ $count: 'totalCount' }],
            },
          },
        ])
        .allowDiskUse(true);

      const [{ paginatedResult, count }] = res;
      const [{ totalCount }] = count;
      const nPages = totalCount / limit;

      return {
        pages: nPages % 1 !== 0 ? Math.trunc(nPages) + 1 : nPages,
        total: totalCount,
        tags: paginatedResult,
      };
    } catch {
      return {
        pages: 0,
        total: 0,
        tags: [],
      };
    }
  }

  /**
   * generates a color from hexadecimal characters.
   * @private
   * @returns Hexadecimal color
   */
  private static generateColor(): string {
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += TagService.hexLetters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  /**
   * Creates a new label from a name, generating its color with {@linkcode generateColor}
   * and sequential identification with {@linkcode AutoIncrementService.getSequence}.
   * @param name tag's name to create
   * @returns created Tag
   */
  public async createTag(name: string): Promise<Tag> {
    if (!name || /^\s*$/.test(name)) return null;

    const tag: Tag = new this.tagModel();

    tag.name = name;
    tag.color = TagService.generateColor();
    tag._pid = await this.autoIncrementService.getSequence(TAG_MODEL_NAME);

    await tag.save();

    await this.emitUpdateAction(tag, ActionE.ADD);

    return tag;
  }

  /**
   * Edits the name of a tag with its identification.
   * @param id tag identification to edit
   * @param name new tag name
   * @returns true on action done, false when the action fails
   */
  public async editTag(id: string, name: string): Promise<boolean> {
    const tag: Tag = await this.tagModel.findByIdAndUpdate(
      id,
      { name },
      { new: true },
    );
    if (tag) {
      await this.emitUpdateAction(tag, ActionE.EDIT);
      return true;
    }
    return false;
  }

  /**
   * Deletes a tag document from the database
   * @param id Identification to remove.
   * @returns true on action done, false when the action fails
   */
  public async deleteTag(id: string): Promise<boolean> {
    const tag: Tag = await this.tagModel.findByIdAndDelete(id);
    if (tag) await this.emitUpdateAction(tag, ActionE.DELETE);
    return !!tag;
  }

  /**
   * Creates a number of labels with generated values.
   * @param nTags number of Tags to create
   */
  public async insertTags(nTags: number): Promise<boolean> {
    const toSeq = await this.autoIncrementService.getSequence(
      TAG_MODEL_NAME,
      nTags,
    );
    const tags: Tag[] = [];

    for (let i: number = toSeq - nTags + 1; i <= toSeq; i++) {
      const tag = new this.tagModel();
      tag.color = TagService.generateColor();
      tag._pid = i;
      tag.name = `Tag #${i}`;

      tags.push(tag);
    }

    const result = await this.tagModel.insertMany(tags);

    return result.length === nTags;
  }

  /**
   * Emits a new action to update the list.
   * @param tag document to update on clients.
   * @param action action to perform.
   */
  private async emitUpdateAction(tag: Tag, action: ActionE): Promise<void> {
    await this.pubSub.publish(UPDATE_LIST_EVENT, {
      [UPDATE_LIST_EVENT]: { action: action, tag } as TagUpdate,
    });
  }
}
