import { useEffect, useState } from 'react';
import hash from 'object-hash';
import { getVariant } from '../api/deliver/GetVariant';
import { DeliverVariant, LocalVariant } from '../models/Variant';
import SolanaVariantDialog, {
  DialogContent
} from '../components/solanaVariantCard/SolanaVariantDialog';
import { deliverVariantNotFound, obsoleteBlockchainVariant } from '../templates/dialogTemplates';
import {
  areStringsEqual,
  issueTypeToSolanaVariantIntegrityMapper,
  makeSentence
} from '../utils/Utils';
import { DatabaseVariantWithId, getDatabaseVariantOrNull } from '../utils/firebase';

export enum SolanaVariantIntegrityState {
  Compromised,
  Intact,
  Obsolete,
  NotFound,
  Unknown
}

export const useSolanaVariantCardStateManager = (
  variant: LocalVariant,
  handleIntegrityViolation: () => void,
  handleRemove: () => void
) => {
  const [checkingIntegrity, setCheckingIntegrity] = useState(false);
  const [variantIntegrityInfoMessage, setVariantIntegrityInfoMessage] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [databaseMetaData, setDatabaseMetaData] = useState<DatabaseVariantWithId | null>(null);
  const [dialogContent, setDialogContent] = useState<DialogContent>({
    title: '',
    body: <></>
  });
  const [variantIntegrityState, setVariantIntegrityState] = useState<SolanaVariantIntegrityState>(
    SolanaVariantIntegrityState.Unknown
  );

  // Set initaial state with data from database
  useEffect(() => {
    const fetchDatabaseVariant = async () => {
      return await getDatabaseVariantOrNull(variant.publicKey);
    };

    fetchDatabaseVariant()
      .then((data) => {
        setDatabaseMetaData(data);
        const issueType = data?.databaseVariant.issueType;
        const persistedState = issueTypeToSolanaVariantIntegrityMapper(issueType);
        setVariantIntegrityState(persistedState);

        if (issueType) setVariantIntegrityInfoMessage(makeSentence(issueType));
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  const notifyVariantIsObsolete = (
    deliverVariantLastModified: Date,
    solanaVariantLastModified: Date
  ) => {
    setDialogContent(
      obsoleteBlockchainVariant(deliverVariantLastModified, solanaVariantLastModified)
    );
    setVariantIntegrityState(SolanaVariantIntegrityState.Obsolete);
    setShowDialog(true);
  };

  const notifyVariantNotFound = () => {
    setDialogContent(deliverVariantNotFound);
    setVariantIntegrityState(SolanaVariantIntegrityState.NotFound);
    setShowDialog(true);
  };

  const moveToObsoleteState = () => {
    setShowDialog(false);
    if (SolanaVariantIntegrityState.Obsolete) {
      setVariantIntegrityInfoMessage('Variant is obsolete.');
    } else if (SolanaVariantIntegrityState.NotFound) {
      setVariantIntegrityInfoMessage('Deliver variant was not found.');
    }

    setVariantIntegrityState(SolanaVariantIntegrityState.Obsolete);
  };

  const moveToCompromisedState = () => {
    setVariantIntegrityInfoMessage('Variant hash mismatch!');
    setVariantIntegrityState(SolanaVariantIntegrityState.Compromised);
    handleIntegrityViolation();
  };

  const removeVariant = () => {
    setVariantIntegrityInfoMessage('Variant can be removed.');
    setShowDialog(false);
    if (databaseMetaData) handleRemove();
  };

  const evaluateStateFromDeliverVariant = (deliverVariant: DeliverVariant) => {
    const deliverVariantLastModified = new Date(deliverVariant.system.last_modified);
    const blockchainVariantLastModified = new Date(variant.lastModified);

    // We need to remove millis from the date, because they were lost when blockchainVariantLastModified was converted from byte array (BN library) to date object.
    const areLastModifiedDatesEqual =
      deliverVariantLastModified.getTime() - deliverVariantLastModified.getMilliseconds() ===
      blockchainVariantLastModified.getTime();

    const deliverVariantHash = hash(deliverVariant);
    const areVariantHashesEqual = areStringsEqual(deliverVariantHash, variant.variantHash);

    if (!areLastModifiedDatesEqual) {
      notifyVariantIsObsolete(deliverVariantLastModified, blockchainVariantLastModified);
    } else if (!areVariantHashesEqual) {
      //hashCompareMissmatchMessageTemplate(deliverVariantHash, variant.variantHash)
      moveToCompromisedState();
    } else {
      setVariantIntegrityState(SolanaVariantIntegrityState.Intact);
    }
  };

  const checkIntegrity = () => {
    setCheckingIntegrity(true);
    setVariantIntegrityInfoMessage('Checking integrity.');
    setVariantIntegrityState(SolanaVariantIntegrityState.Unknown);

    getVariant(variant.projectId, variant.itemCodename, variant.variantId)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          notifyVariantNotFound();
          throw response;
        }
      })
      .then((deliverItem) => {
        evaluateStateFromDeliverVariant(deliverItem.item);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setCheckingIntegrity(false);
      });
  };

  const IntegrityCompromisationCheckDialog = () => (
    <SolanaVariantDialog
      open={showDialog}
      handleConfirm={removeVariant}
      handleDeny={moveToObsoleteState}
      dialogContent={dialogContent}
    />
  );

  return {
    checkIntegrity,
    checkingIntegrity,
    variantIntegrityState,
    IntegrityCompromisationCheckDialog,
    variantIntegrityInfoMessage
  };
};
