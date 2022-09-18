import { deliverAPIBaseUrl } from '../../AppConfig';

export const getVariant = async (projectId: string, itemCodename: string, variantId: string) => {
  console.log(itemCodename);
  return fetch(deliverAPIBaseUrl + projectId + '/items/' + itemCodename + '?language=' + variantId);
};
