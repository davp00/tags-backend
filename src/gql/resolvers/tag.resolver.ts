import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { TagService } from '../../services/tag/tag.service';
import { UPDATE_LIST_EVENT } from '../constants/subscriptions';
import { TagUpdate } from '../types/tag.uptade';
import { PaginationOptions } from '../types/pagination.options';
import { TagListPaginated } from '../types/taglist.paginated';
import { GraphqlField } from '../types/graphqlfield.abstract';

/**
 * Class in charge of resolve queries, mutations, subscriptions of the graphql for the Tag object
 */
@Resolver()
export class TagResolver {
  /**
   * Constructor in which the different dependencies are injected by the module {@linkcode GqlModule}
   * @param tagService injected service to execute the different actions of the tags
   * @param pubSub Used to listen to the different events of the graphql subscriptions
   */
  constructor(
    private readonly tagService: TagService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

  /**
   * Uses {@linkcode TagService.getTags} to get tag list elements
   * @param paginationOptions paging options provide by graphql client
   * @returns Tag list to the client
   */
  @Query(GraphqlField.typeOf(TagListPaginated))
  tagList(
    @Args('pagination', { type: GraphqlField.typeOf(PaginationOptions) })
    paginationOptions: PaginationOptions,
  ) {
    return this.tagService.getTags(paginationOptions);
  }

  /**
   * Listens to the Tag Document events
   */
  @Subscription(GraphqlField.typeOf(TagUpdate), {
    name: UPDATE_LIST_EVENT,
  })
  updateTagList() {
    return this.pubSub.asyncIterator(UPDATE_LIST_EVENT);
  }

  /**
   * Uses {@linkcode TagService.createTag} to create the tag
   * @param name tag's name provided by graphql client
   * @returns true on create Tag done
   */
  @Mutation(GraphqlField.boolean)
  async createTag(@Args('name') name: string) {
    return (await this.tagService.createTag(name)) != null;
  }

  /**
   * Uses {@linkcode TagService.editTag} to edit the tag
   * @param id Tag identification to edit
   * @param name new tag's name provided by graphql client
   * @returns true on edit Tag done
   */
  @Mutation(GraphqlField.boolean)
  editTag(@Args('id') id: string, @Args('name') name: string) {
    return this.tagService.editTag(id, name);
  }

  /**
   * Uses {@linkcode TagService.deleteTag} to delete the tag.
   * @param id
   * @returns true on delete Tag done.
   */
  @Mutation(GraphqlField.boolean)
  deleteTag(@Args('id') id: string) {
    return this.tagService.deleteTag(id);
  }

  /**
   * Uses {@linkcode TagService.insertTags} to insert a defined number of tags.
   * @param nTags number of Tags to create, provided by graphql client
   */
  @Mutation(GraphqlField.boolean)
  insertTags(
    @Args('nTags', { type: GraphqlField.int }) nTags: number,
  ): Promise<boolean> {
    return this.tagService.insertTags(nTags);
  }
}
