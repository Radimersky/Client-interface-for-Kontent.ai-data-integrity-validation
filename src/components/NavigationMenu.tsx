import { AppBar, Container, Toolbar, Box, Typography, MenuItem } from '@mui/material';
import MyWallet from './MyWallet';

const pages = ['Products', 'Pricing', 'Blog'];

const NavigationMenu = () => (
  <AppBar position="static">
    <Container maxWidth="xl">
      <Box sx={{ flexGrow: 1 }}>
        <Toolbar>
          <MenuItem sx={{ marginRight: 3 }}>
            <MyWallet />
          </MenuItem>
          {pages.map((page) => (
            <MenuItem key={page} onClick={() => {}}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} textAlign="center">
                {page}
              </Typography>
            </MenuItem>
          ))}
        </Toolbar>
      </Box>
    </Container>
  </AppBar>
);

export default NavigationMenu;
