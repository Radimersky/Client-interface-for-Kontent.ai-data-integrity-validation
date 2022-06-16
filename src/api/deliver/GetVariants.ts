import { deliverBaseUrl } from '../../Constants';

export const getVariants = async (projectId: string, variantId: string) => {
  return fetch(deliverBaseUrl + projectId + '/items-feed?language=' + variantId);
};
