import { AppBar, Container, Toolbar, Box, Typography, MenuItem, Button } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { blockchainPage } from '../App';
import MyWallet from './MyWallet';
import { useNavigate } from 'react-router';

const pages = ['Blockchain variants'];

const NavigationMenu = () => {
  const { connected } = useWallet();
  const navigate = useNavigate();
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Box sx={{ flexGrow: 1 }}>
          <Toolbar>
            {connected &&
              pages.map((page) => (
                <MenuItem key={page} onClick={() => navigate(blockchainPage)}>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} textAlign="center">
                    {page}
                  </Typography>
                </MenuItem>
              ))}
            <Box sx={{ flexGrow: 1 }}></Box>
            <MenuItem>
              <Button variant="contained">Sync variants</Button>
            </MenuItem>
            <MenuItem>
              <MyWallet />
            </MenuItem>
          </Toolbar>
        </Box>
      </Container>
    </AppBar>
  );
};

export default NavigationMenu;
