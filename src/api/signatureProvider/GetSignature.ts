// eslint-disable-next-line no-unused-vars
import { DeliverVariant } from '../../models/Variant';

export const getSignature = async (deliverVariant: DeliverVariant) => {
  return fetch('http://localhost:3001/sign/', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(deliverVariant)
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .then((data) => {
      return data;
    })
    .catch((e) => {
      console.error(e);
    });
};
