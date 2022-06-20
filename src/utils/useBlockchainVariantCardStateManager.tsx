import { useState } from 'react';
import hash from 'object-hash';
import { getVariant } from '../api/deliver/GetVariant';
// eslint-disable-next-line no-unused-vars
import { DeliverVariant, Variant } from '../models/Variant';
import BlockchainVariantDialog, {
  DialogContent
} from '../components/blockchainVariantCard/BlockchainVariantDialog';
import { deliverVariantNotFound, obsoleteBlockchainVariant } from './dialogTemplates';

export enum VariantIntegrity {
  Compromised,
  Intact,
  Deciding,
  Unknown
}

const useBlockchainVariantCardStateManager = (
  variant: Variant,
  handleIntegrityViolation: () => void
) => {
  const [checkingIntegrity, setCheckingIntegrity] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [dialogContent, setDialogContent] = useState<DialogContent>({
    title: '',
    body: <></>
  });
  const [variantIntegrity, setVariantIntegrity] = useState<VariantIntegrity>(
    VariantIntegrity.Unknown
  );

  const makeVariantOk = () => {
    setVariantIntegrity(VariantIntegrity.Intact);
    setShowDialog(false);
  };

  const compareHashes = (deliverVariantHash: string, blockchainVariantHash: string) => {
    return deliverVariantHash.localeCompare(blockchainVariantHash) === 0;
  };

  const checkVariantIsObsolete = (
    deliverVariantLastModified: Date,
    blockchainVariantLastModified: Date
  ) => {
    setDialogContent(
      obsoleteBlockchainVariant(deliverVariantLastModified, blockchainVariantLastModified)
    );
    setShowDialog(true);
  };

  const checkVariantNotFound = () => {
    setDialogContent(deliverVariantNotFound);
    setShowDialog(true);
  };

  const makeVariantIntegrityViolated = () => {
    setShowDialog(false);
    setVariantIntegrity(VariantIntegrity.Compromised);
    setInfoMessage('Integrity violated!');
    handleIntegrityViolation();
  };

  const checkIntegrity = () => {
    setCheckingIntegrity(true);
    setVariantIntegrity(VariantIntegrity.Unknown);

    getVariant(variant.projectId, variant.itemCodename, variant.variantId)
      .then((response) => {
        if (response.ok) return response.json();
        else {
          setVariantIntegrity(VariantIntegrity.Deciding);
          checkVariantNotFound();
          throw response;
        }
      })
      .then((deliverItem) => {
        const deliverVariant: DeliverVariant = deliverItem.item;

        const deliverVariantLastModified = new Date(deliverVariant.system.last_modified);
        const blockchainVariantLastModified = new Date(variant.lastModified);
        console.log(deliverVariantLastModified.getTime());
        console.log(blockchainVariantLastModified.getTime());

        // We need to remove millis from the date, because they were lost when blockchainVariantLastModified was converted from byte array (BN library) to date object
        if (
          deliverVariantLastModified.getTime() - deliverVariantLastModified.getMilliseconds() !==
          blockchainVariantLastModified.getTime()
        ) {
          setVariantIntegrity(VariantIntegrity.Deciding);
          checkVariantIsObsolete(deliverVariantLastModified, blockchainVariantLastModified);
        } else if (!compareHashes(hash(deliverVariant), variant.variantHash)) {
          setVariantIntegrity(VariantIntegrity.Compromised);
          makeVariantIntegrityViolated();
        } else {
          setVariantIntegrity(VariantIntegrity.Intact);
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
      handleConfirm={makeVariantIntegrityViolated}
      handleDeny={makeVariantOk}
      dialogContent={dialogContent}
    />
  );

  return {
    checkIntegrity,
    checkingIntegrity,
    variantIntegrity,
    IntegrityCompromisationCheckDialog,
    infoMessage
  };
};

export default useBlockchainVariantCardStateManager;
