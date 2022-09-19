import { deliverAPIBaseUrl } from '../../AppConfig';

export const getVariants = async (projectId: string, variantId: string, token?: string) => {
  return fetch(deliverAPIBaseUrl + projectId + '/items-feed?language=' + variantId, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
  });
};
