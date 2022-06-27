// eslint-disable-next-line no-unused-vars
import { DeliverVariant, KontentSignature } from '../../models/Variant';

export const getSignature = async (deliverVariant: DeliverVariant) => {
  console.log('here');
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
      } else {
        throw response;
      }
    })
    .then((data) => {
      return data;
    })
    .catch((e) => {
      console.error(e);
      return null;
    });

  // console.log(resp);

  // return { hash: 'variantHash', signature: '1234abcd' };
};
