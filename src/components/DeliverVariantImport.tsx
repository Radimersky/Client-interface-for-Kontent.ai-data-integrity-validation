import { Box, TextField, Button } from '@mui/material';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';

interface IDeliverVariantImportProps {
  readonly onSubmit: (projectId: string) => void;
  readonly error: boolean;
  readonly importing: boolean;
}

const DeliverVariantImport: React.FC<IDeliverVariantImportProps> = ({
  onSubmit,
  error,
  importing
}) => {
  const [projectId, setProjectId] = useState('');

  return (
    <Box component="form" sx={{ display: 'flex', alignItems: 'center' }}>
      <TextField
        id="filled-basic"
        label="Project ID"
        variant="filled"
        onChange={(e) => setProjectId(e.target.value)}
        error={error}
        helperText={error ? 'Failed to import variants' : ' '}
        disabled={importing}
      />
      <Button
        variant="contained"
        startIcon={importing ? <CircularProgress size={20} /> : <AddIcon />}
        onClick={() => onSubmit(projectId)}
        disabled={importing}>
        Import variants
      </Button>
    </Box>
  );
};

export default DeliverVariantImport;
