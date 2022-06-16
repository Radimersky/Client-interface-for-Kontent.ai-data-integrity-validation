import { Box, CircularProgress } from '@mui/material';

export const Loader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
    <CircularProgress size={100} />
  </Box>
);
