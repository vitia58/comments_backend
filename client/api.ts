import { api } from '../../services';
import { TGetComments, TNewComment, TOneComment, TOneTopic } from './types';

const basePath = '/comments';

export const getCommentsApi = async ({
  topic,
  commentsCount,
}: TGetComments) => {
  const response = await api.get<TOneComment>(
    `${basePath}/${topic}?offset=${commentsCount}&limit=25`
  );
  return response.data;
};

export const getTopicsApi = async () => {
  const response = await api.get<TOneTopic[]>(`topics`);
  return response.data;
};

export const createCommentsApi = async (data: TNewComment) => {
  await api.post(basePath, data);
};
