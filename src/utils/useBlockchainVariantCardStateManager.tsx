import { useState } from 'react';
import hash from 'object-hash';
import { getVariant } from '../api/deliver/GetVariant';
// eslint-disable-next-line no-unused-vars
import { DeliverVariant, Variant } from '../models/Variant';
import BlockchainVariantDialog, {
  DialogContent
} from '../components/blockchainVariantCard/BlockchainVariantDialog';
import { deliverVariantNotFound, obsoleteBlockchainVariant } from '../templates/dialogTemplates';
import { areStringsEqual } from './Utils';

export enum VariantIntegrity {
  Compromised,
  Intact,
  Obsolete,
  Unknown
}

const useBlockchainVariantCardStateManager = (
  variant: Variant,
  handleIntegrityViolation: () => void,
  handleRemove: () => void
) => {
  const [checkingIntegrity, setCheckingIntegrity] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState<DialogContent>({
    title: '',
    body: <></>
  });
  const [variantIntegrityState, setVariantIntegrityState] = useState<VariantIntegrity>(
    VariantIntegrity.Unknown
  );

  const notifyVariantIsObsolete = (
    deliverVariantLastModified: Date,
    blockchainVariantLastModified: Date
  ) => {
    setDialogContent(
      obsoleteBlockchainVariant(deliverVariantLastModified, blockchainVariantLastModified)
    );
    setShowDialog(true);
  };

  const notifyVariantNotFound = () => {
    setDialogContent(deliverVariantNotFound);
    setShowDialog(true);
  };

  const moveToObsoleteState = () => {
    setShowDialog(false);
    setVariantIntegrityState(VariantIntegrity.Obsolete);
  };

  const moveToCompromisedState = () => {
    setVariantIntegrityState(VariantIntegrity.Compromised);
    handleIntegrityViolation();
  };

  const removeVariant = () => {
    setShowDialog(false);
    handleRemove();
  };

  const checkIntegrity = () => {
    setCheckingIntegrity(true);
    setInfoMessage('Checking integrity.');
    setVariantIntegrityState(VariantIntegrity.Unknown);

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
        const deliverVariant: DeliverVariant = deliverItem.item;

        const deliverVariantLastModified = new Date(deliverVariant.system.last_modified);
        const blockchainVariantLastModified = new Date(variant.lastModified);

        // We need to remove millis from the date, because they were lost when blockchainVariantLastModified was converted from byte array (BN library) to date object
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
          setVariantIntegrityState(VariantIntegrity.Intact);
        }
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
