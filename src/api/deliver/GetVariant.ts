import { deliverAPIBaseUrl } from '../../AppSettingConstants';

export const getVariant = async (projectId: string, itemCodename: string, variantId: string) => {
  return fetch(deliverAPIBaseUrl + projectId + '/items/' + itemCodename + '?language=' + variantId);
};
