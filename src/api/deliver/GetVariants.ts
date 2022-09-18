import { deliverAPIBaseUrl } from '../../AppConfig';

export const getVariants = async (projectId: string, variantId: string) => {
  return fetch(deliverAPIBaseUrl + projectId + '/items-feed?language=' + variantId);
};
