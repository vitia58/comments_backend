import { PipelineStage } from 'mongoose';

export class TopicPipelines {
  static getCommentHeadPipeline(): PipelineStage[] {
    return [
      {
        $match: {
          parent: null,
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          text: 1,
          date: 1,
        },
      },
    ];
  }
}
