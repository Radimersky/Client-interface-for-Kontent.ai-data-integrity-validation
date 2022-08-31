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
    <Box
      component="form"
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
      }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          padding: '20px',
          borderRadius: '7px',
          border: '2px #1976d2 solid',
          minWidth: '400px',
          marginTop: '20px'
        }}>
        <TextField
          id="filled-basic"
          label="Project ID"
          variant="filled"
          onChange={(e) => setProjectId(e.target.value)}
          error={error}
          helperText={error ? 'Failed to import variants' : ' '}
          disabled={importing}
          sx={{
            width: '350px'
          }}
        />
        <Button
          variant="contained"
          startIcon={importing ? <CircularProgress size={20} /> : <AddIcon />}
          onClick={() => onSubmit(projectId)}
          disabled={importing}>
          Import variants
        </Button>
      </Box>
    </Box>
  );
};

export default DeliverVariantImport;
