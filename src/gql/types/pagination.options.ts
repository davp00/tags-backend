import { Field, InputType } from '@nestjs/graphql';
import { GraphqlField } from './graphqlfield.abstract';

/**
 * This class is used to parameterize the options to paginate a result in graphql
 */
@InputType()
export class PaginationOptions {
  /**
   * Response element limit
   */
  @Field(GraphqlField.int)
  limit: number;

  /**
   * Page to fetch
   */
  @Field(GraphqlField.int)
  page: number;
}
