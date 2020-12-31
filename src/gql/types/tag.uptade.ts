import { ObjectType, Field } from '@nestjs/graphql';
import { Tag } from '../../models/tag';
import { ActionE } from '../enums';
import { GraphqlField } from './graphqlfield.abstract';

/**
 * A graphql object type, used to send actions to the client to update the Tag list
 */
@ObjectType()
export class TagUpdate {
  /**
   * Action to take
   */
  @Field(GraphqlField.typeOf(ActionE))
  action: ActionE;

  /**
   * Tag to update
   */
  @Field(GraphqlField.typeOf(Tag))
  tag: Tag;
}
