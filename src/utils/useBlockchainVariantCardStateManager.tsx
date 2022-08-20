import { useEffect, useState } from 'react';
import hash from 'object-hash';
import { getVariant } from '../api/deliver/GetVariant';
import { DeliverVariant, LocalVariant } from '../models/Variant';
import BlockchainVariantDialog, {
  DialogContent
} from '../components/blockchainVariantCard/BlockchainVariantDialog';
import { deliverVariantNotFound, obsoleteBlockchainVariant } from '../templates/dialogTemplates';
import { areStringsEqual, issueTypeToVariantIntegrityMapper, makeSentence } from './Utils';
import { DatabaseVariantWithId, getDatabaseVariantOrNull } from './firebase';

export enum VariantIntegrityState {
  Compromised,
  Intact,
  Obsolete,
  NotFound,
  Unknown
}

const useBlockchainVariantCardStateManager = (
  variant: LocalVariant,
  handleIntegrityViolation: () => void,
  handleRemove: () => void
) => {
  const [checkingIntegrity, setCheckingIntegrity] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [databaseMetaData, setDatabaseMetaData] = useState<DatabaseVariantWithId | null>(null);
  const [dialogContent, setDialogContent] = useState<DialogContent>({
    title: '',
    body: <></>
  });
  const [variantIntegrityState, setVariantIntegrityState] = useState<VariantIntegrityState>(
    VariantIntegrityState.Unknown
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
        const persistedState = issueTypeToVariantIntegrityMapper(issueType);
        setVariantIntegrityState(persistedState);

        if (issueType) setInfoMessage(makeSentence(issueType));
      })
      .catch(console.error);
  }, []);

  const notifyVariantIsObsolete = (
    deliverVariantLastModified: Date,
    blockchainVariantLastModified: Date
  ) => {
    setDialogContent(
      obsoleteBlockchainVariant(deliverVariantLastModified, blockchainVariantLastModified)
    );
    setVariantIntegrityState(VariantIntegrityState.Obsolete);
    setShowDialog(true);
  };

  const notifyVariantNotFound = () => {
    setDialogContent(deliverVariantNotFound);
    setVariantIntegrityState(VariantIntegrityState.NotFound);
    setShowDialog(true);
  };

  const moveToObsoleteState = () => {
    setShowDialog(false);
    if (VariantIntegrityState.Obsolete) {
      setInfoMessage('Variant is obsolete.');
    } else if (VariantIntegrityState.NotFound) {
      setInfoMessage('Deliver variant was not found.');
    }

    setVariantIntegrityState(VariantIntegrityState.Obsolete);
  };

  const moveToCompromisedState = () => {
    setInfoMessage('Variant hash mismatch!');
    setVariantIntegrityState(VariantIntegrityState.Compromised);
    handleIntegrityViolation();
  };

  const removeVariant = () => {
    setInfoMessage('Variant can be removed.');
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
      setVariantIntegrityState(VariantIntegrityState.Intact);
    }
  };

  const checkIntegrity = () => {
    setCheckingIntegrity(true);
    setInfoMessage('Checking integrity.');
    setVariantIntegrityState(VariantIntegrityState.Unknown);

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
    <BlockchainVariantDialog
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
    infoMessage
  };
};

export default useBlockchainVariantCardStateManager;
