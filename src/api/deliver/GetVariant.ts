import { deliverBaseUrl } from '../../Constants';

export const getVariant = async (projectId: string, itemId: string, variantId: string) => {
  return fetch(deliverBaseUrl + projectId + '/items/' + itemId + '?language=' + variantId);
};
