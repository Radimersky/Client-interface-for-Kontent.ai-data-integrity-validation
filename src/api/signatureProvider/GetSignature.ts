import hash from 'object-hash';
// eslint-disable-next-line no-unused-vars
import { DeliverVariant, KontentSignature } from '../../models/Variant';

export const getSignature = (deliverVariant: DeliverVariant): KontentSignature => {
  const variantHash = hash(deliverVariant);
  return { hash: variantHash, signature: '1234abcd' };
};
