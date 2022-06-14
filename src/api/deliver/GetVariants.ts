import { deliverBaseUrl } from '../../Constants';

export const getVariantsByProjectId = async (projectId: string, languageId: string) => {
  return fetch(deliverBaseUrl + projectId + '/items-feed?language=' + languageId);
};
