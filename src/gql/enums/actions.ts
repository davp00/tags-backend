import { registerEnumType } from '@nestjs/graphql';

/**
 * Contains the actions used to notify changes in real time on the list of labels
 */
export enum ActionE {
  ADD = 'ADD',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
}

// Register enum in Graphql
registerEnumType(ActionE, { name: 'Action' });
