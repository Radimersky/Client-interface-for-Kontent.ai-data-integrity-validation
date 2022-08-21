import { DialogContent } from '../components/solanaVariantCard/SolanaVariantDialog';

export const deliverVariantNotFound: DialogContent = {
  title: 'Deliver variant not found',
  body: (
    <>
      <p>It looks like the variant from the Deliver does not longer exist.</p>
      <p>The variant saved on blockchain does not have a purpose anymore and can be removed.</p>
      <p style={{ paddingTop: '20px' }}>
        <b>Do you want to remove the variant from blockchain?</b>
      </p>
    </>
  )
};

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
      <p>The variant saved on blockchain does not have a purpose anymore and can be removed.</p>
      <p style={{ paddingTop: '20px' }}>
        <b>Do you want to remove the variant from blockchain?</b>
      </p>
    </>
  )
});
