import { deliverBaseUrl } from '../../Constants';

export const getVariantsByProjectId = async (projectId: string) => {
  return fetch(deliverBaseUrl + projectId + '/items');
};
