// eslint-disable-next-line no-unused-vars
import { DialogContent } from '../components/blockchainVariantCard/BlockchainVariantDialog';

export const deliverVariantNotFound: DialogContent = {
  title: 'Deliver variant not found',
  body: (
    <>
      <p>It looks like the variant from Deliver does not longer exist.</p>
      <p>
        It was probably removed or unpushlished, but it may also mean that integrity of the
        variant&quot;s identifiers were corrupted.
      </p>
      <p style={{ paddingTop: '20px' }}>
        <b>Do you want to mark the variant as integrity violated?</b>
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
        The variant on Deliver was last modified {deliverLastModified.getDate()} but the version of
        variant on blockchain was last modified {blockchainLastModified.getDate()}.
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
