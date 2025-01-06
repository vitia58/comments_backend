import { CollectionEnum } from 'src/common/enums/CollectionEnum';

export class CommentsPipelines {
  static getCommentsPipeline(parent: string | null = null) {
    return [
      {
        $match: {
          parent,
        },
      },
      {
        $graphLookup: {
          from: CollectionEnum.Comment,
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'parent',
          as: 'replies',
          maxDepth: 1,
        },
      },
    ];
  }
}
