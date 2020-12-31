import { Int, ID } from '@nestjs/graphql';

/**
 * This class provides Field decorators with
 * the object types functions so that they can be rendered in a file with a .graphql extension later by the Graphql module.
 */
export abstract class GraphqlField {
  /**
   * This function is used to return the fields in the format required by the Field decorator
   * @typeParam T Generic parameter
   * @param object object to return as type function
   * @returns returns a type of Object function
   */
  public static typeOf = <T>(object: T): (() => T) => {
    return () => object;
  };

  /**
   * provides the scalar {@linkcode ID} type as a type function
   */
  public static id = GraphqlField.typeOf(ID);

  /**
   * provides the scalar {@linkcode Int} type as a type function
   */
  public static int = GraphqlField.typeOf(Int);

  /**
   * provides the scalar {@linkcode Boolean} type as a type function
   */
  public static boolean = GraphqlField.typeOf(Boolean);
}
