import { SolanaVariantIntegrityState } from '../hooks/useSolanaVariantCardStateManager';
import { IssueType } from './Firebase';
import dayjs from 'dayjs';

export const areStringsEqual = (a: string, b: string) => {
  return a.localeCompare(b) === 0;
};

export const solanaVariantIntegritytoIssueTypeMapper = (
  variantIntegrity: SolanaVariantIntegrityState
): IssueType | null => {
  switch (variantIntegrity) {
    case SolanaVariantIntegrityState.Compromised:
      return IssueType.Compromised;
    case SolanaVariantIntegrityState.NotFound:
      return IssueType.NotFound;
    case SolanaVariantIntegrityState.Obsolete:
      return IssueType.Obsolete;
    default:
      return null;
  }
};

export const issueTypeToSolanaVariantIntegrityMapper = (
  issueType: IssueType | null | undefined
): SolanaVariantIntegrityState => {
  switch (issueType) {
    case IssueType.Compromised:
      return SolanaVariantIntegrityState.Compromised;
    case IssueType.NotFound:
      return SolanaVariantIntegrityState.NotFound;
    case IssueType.Obsolete:
      return SolanaVariantIntegrityState.Obsolete;
    default:
      return SolanaVariantIntegrityState.Unknown;
  }
};

export const makeSentence = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1) + '.';
};

export const formatIsoString = (isoString: string): string => {
  return dayjs(isoString).toString();
};
