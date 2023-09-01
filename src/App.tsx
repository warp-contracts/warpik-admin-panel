import { Component, createEffect, createSignal } from 'solid-js';

import Header from './components/Header/Header';
import Form from './components/Form/Form';
import { Box, ThemeProvider, createTheme, useTheme } from '@suid/material';
import Wallet from './components/Wallet/Wallet';
//@ts-ignore
import { InjectedEthereumSigner } from 'warp-contracts-plugin-signature';
import { providers } from 'ethers';
import { WarpFactory } from 'warp-contracts';
import Interactions from './components/Interactions/Interactions';

const App: Component = () => {
  const [wallet, setWallet] = createSignal({});
  const [walletId, setWalletId] = createSignal('');
  const [warp, setWarp] = createSignal({});

  createEffect(async () => {
    const warp = WarpFactory.forMainnet();
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const walletId = accounts[0];
    if (walletId) {
      setWalletId(walletId);
    }
    setWarp(warp);
  });

  const theme = createTheme({
    palette: {
      primary: {
        main: '#ff99c8',
      },
      secondary: {
        main: '#d0f4de',
      },
    },
  });

  const handleWallet = async () => {
    await window.ethereum.enable();

    const wallet = new providers.Web3Provider(window.ethereum);

    const userSigner = new InjectedEthereumSigner(wallet);
    await userSigner.setPublicKey();

    if (!walletId()) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const walletId = accounts[0];
      setWalletId(walletId);
    }
    setWallet(userSigner);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          height: '100vh',
          width: '100%',
          padding: '4px',
          color: theme.palette.primary.main,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Wallet handleWallet={handleWallet} walletId={walletId()} />
        <Interactions />
        <Header />
        <Form wallet={wallet()} warp={warp()} />
      </Box>
    </ThemeProvider>
  );
};

export default App;
