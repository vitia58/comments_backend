import { ModelDefinition, SchemaFactory } from '@nestjs/mongoose';
import { model } from 'mongoose';
import { Comment } from 'src/models/comments.model';
export const collectionList = {
  Comment,
};

export const CollectionsImport = Object.values(collectionList)
  .map<ModelDefinition>((i) => {
    const schema = SchemaFactory.createForClass<any>(i);
    return {
      name: i.name,
      schema,
      collection: model(i.name, schema).collection.name,
    };
  })
  .reduce(
    (p, c) => ({ ...p, [c.name]: c }),
    {} as Record<
      keyof typeof collectionList,
      Omit<ModelDefinition, 'schema'> & {
        schema: ReturnType<typeof SchemaFactory.createForClass<any>>;
      }
    >,
  );
