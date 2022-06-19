import { deliverBaseUrl } from '../../Constants';

export const getVariant = async (projectId: string, itemCodename: string, variantId: string) => {
  console.log(projectId);
  return fetch(deliverBaseUrl + projectId + '/items/' + itemCodename + '?language=' + variantId);
};
