import { deliverBaseUrl } from '../../Constants';

export const getVariant = async (projectId: string, itemId: string, variantId: string) => {
  console.log(projectId);
  return fetch(deliverBaseUrl + projectId + '/items/' + itemId + '?language=' + variantId);
};
