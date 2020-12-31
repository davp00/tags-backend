import { Tag } from '../../models/tag';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphqlField } from './graphqlfield.abstract';

/**
 * The class is a Graphql type object to return a list of Tags in a paginated way
 */
@ObjectType()
export class TagListPaginated {
  /**
   * Number of available pages
   */
  @Field(GraphqlField.int)
  pages: number;

  /**
   * Total Tag Documents
   */
  @Field(GraphqlField.int)
  total: number;

  /**
   * Tags list
   */
  @Field(GraphqlField.typeOf([Tag]))
  tags: Tag[];
}
