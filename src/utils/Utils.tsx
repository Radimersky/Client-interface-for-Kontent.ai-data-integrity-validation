import { IssueType } from './firebase';
import { VariantIntegrity } from './useBlockchainVariantCardStateManager';

export const areStringsEqual = (a: string, b: string) => {
  return a.localeCompare(b) === 0;
};

export const variantIntegritytoIssueTypeMapper = (
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

export const issueTypeToVariantIntegrityMapper = (
  issueType: IssueType | null | undefined
): VariantIntegrity => {
  switch (issueType) {
    case IssueType.Compromised:
      return VariantIntegrity.Compromised;
    case IssueType.NotFound:
      return VariantIntegrity.NotFound;
    case IssueType.Obsolete:
      return VariantIntegrity.Obsolete;
    default:
      return VariantIntegrity.Unknown;
  }
};

export const makeSentence = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1) + '.';
};
