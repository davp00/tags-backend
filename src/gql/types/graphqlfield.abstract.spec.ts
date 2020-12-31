import { GraphqlField } from './graphqlfield.abstract';
import { ID, Int } from '@nestjs/graphql';
import { TagListPaginated } from './taglist.paginated';

describe('GraphqlField abstract class', () => {
  it('should return a graphql ID type', function () {
    expect(GraphqlField.id()).toBe(ID);
  });

  it('should return a graphql Int type', function () {
    expect(GraphqlField.int()).toBe(Int);
  });

  it('should return a graphql Boolean type', function () {
    expect(GraphqlField.boolean()).toBe(Boolean);
  });

  it('should return a graphql TagListPaginated type', function () {
    expect(GraphqlField.typeOf(TagListPaginated)()).toBe(TagListPaginated);
  });
});
