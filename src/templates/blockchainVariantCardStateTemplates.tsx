import { DialogContent } from '../components/blockchainVariantCard/BlockchainVariantDialog';

export const hashCompareMissmatchMessageTemplate = (
  deliverHash: string,
  blockchainHash: string
): JSX.Element => (
  <>
    <p>Integrity Compromised!</p>
    <p>
      <b>Hash missmatch</b>
    </p>
    <p>Deliver variant hash:</p>
    <p>{deliverHash}</p>
    <p>Blockchain variant hash:</p>
    <p>{blockchainHash}</p>
  </>
);

export const obsoleteBlockchainVariant = (
  deliverLastModified: Date,
  blockchainLastModified: Date
): DialogContent => ({
  title: 'Newer Deliver variant found',
  body: (
    <>
      <p>It looks like the Deliver variant was updated since it was uploaded to blockchain.</p>
      <p>
        The variant on Deliver was last modified {deliverLastModified.toUTCString()} but the version
        of variant on blockchain was last modified {blockchainLastModified.toUTCString()}.
      </p>
      <p>
        It may also mean that integrity of the variant&quot;s property &quot;last_modified&quot; was
        corrupted.
      </p>
      <p style={{ paddingTop: '20px' }}>
        <b>Do you want to mark the variant as integrity violated?</b>
      </p>
    </>
  )
});
