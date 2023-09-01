import { Component, Show } from 'solid-js';
import { Box, Button } from '@suid/material';

const Wallet: Component<{ handleWallet: any; walletId: string }> = (props) => {
  return (
    <Box sx={{ position: 'absolute', right: '15px', top: '15px' }}>
      <Show
        when={props.walletId}
        fallback={
          <Button variant='outlined' onClick={props.handleWallet}>
            Connect
          </Button>
        }
      >
        <Box>{props.walletId}</Box>
      </Show>
    </Box>
  );
};

export default Wallet;
