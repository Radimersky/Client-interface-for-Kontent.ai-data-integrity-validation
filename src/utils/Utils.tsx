import { IssueType } from './firebase';
import { VariantIntegrity } from './useBlockchainVariantCardStateManager';

export const areStringsEqual = (a: string, b: string) => {
  return a.localeCompare(b) === 0;
};

export const VariantIntegritytoIssueTypeMapper = (
  variantIntegrity: VariantIntegrity
): IssueType | null => {
  switch (variantIntegrity) {
    case VariantIntegrity.Compromised:
      return IssueType.Compromised;
    case VariantIntegrity.NotFound:
      return IssueType.NotFound;
    case VariantIntegrity.Obsolete:
      return IssueType.Obsolete;
    default:
      return null;
  }
};
