import { deliverAPIBaseUrl } from '../../AppConfig';

export const getVariant = async (
  projectId: string,
  itemCodename: string,
  variantId: string,
  token?: string
) => {
  return fetch(
    deliverAPIBaseUrl + projectId + '/items/' + itemCodename + '?language=' + variantId,
    {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    }
  );
};
