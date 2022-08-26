import { IssueType } from './firebase';
import { VariantIntegrityState } from '../hooks/useSolanaVariantCardStateManager';

export const areStringsEqual = (a: string, b: string) => {
  return a.localeCompare(b) === 0;
};

export const variantIntegritytoIssueTypeMapper = (
  variantIntegrity: VariantIntegrityState
): IssueType | null => {
  switch (variantIntegrity) {
    case VariantIntegrityState.Compromised:
      return IssueType.Compromised;
    case VariantIntegrityState.NotFound:
      return IssueType.NotFound;
    case VariantIntegrityState.Obsolete:
      return IssueType.Obsolete;
    default:
      return null;
  }
};

export const issueTypeToVariantIntegrityMapper = (
  issueType: IssueType | null | undefined
): VariantIntegrityState => {
  switch (issueType) {
    case IssueType.Compromised:
      return VariantIntegrityState.Compromised;
    case IssueType.NotFound:
      return VariantIntegrityState.NotFound;
    case IssueType.Obsolete:
      return VariantIntegrityState.Obsolete;
    default:
      return VariantIntegrityState.Unknown;
  }
};

export const makeSentence = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1) + '.';
};
