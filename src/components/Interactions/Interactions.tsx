import {
  Box,
  IconButton,
  Paper,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@suid/material';
import { For, createSignal, mapArray } from 'solid-js';
import KeyboardDoubleArrowLeft from '@suid/icons-material/KeyboardDoubleArrowLeft';

const Interactions = () => {
  const [anchorEl, setAnchorEl] = createSignal<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent & { currentTarget: HTMLButtonElement }) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = () => Boolean(anchorEl());
  const id = () => (open() ? 'simple-popover' : undefined);

  const createData = (functionName: string, input: any) => {
    return { function: functionName, input: JSON.stringify(input) };
  };
  const rows = [
    createData('evolve', { value: '123' }),
    createData('registerUser', { id: '666', address: '123' }),
    createData('addMessage', { id: '123', messageId: 666, content: 'message' }),
    createData('addReaction', { id: '123' }),
    createData('getAddress', { id: '123' }),
    createData('getCounter', { id: '123' }),
    createData('balance', { target: '123' }),
    createData('mint', { id: '123' }),
    createData('transfer', { target: '123', qty: 10 }),
    createData('removeMessage', { id: '123', messageId: '666' }),
    createData('removeReaction', { id: '123' }),
    createData('addBoost', { name: 'boost', value: 'boostValue' }),
    createData('getBoost', { name: 'boost' }),
    createData('removeBoost', { name: 'boost' }),
    createData('changeBoost', { name: 'boost', value: 'boostValue' }),
    createData('addUserBoost', { id: '123', name: 'boost' }),
    createData('removeUserBoost', { id: '123', name: 'boost' }),
    createData('addPoints', { id: '123', points: 10, adminId: '666' }),
    createData('addAdmin', { id: '666' }),
    createData('removeAdmin', { id: '123' }),
    createData('removePoints', { id: '123', points: 10, adminId: '666' }),
    createData('addSeason', { name: 'season', from: '123', to: '666', boost: 'boost' }),
  ];

  return (
    <Box position='absolute' right='0' top='15%'>
      <IconButton aria-describedby={id()} onClick={handleClick}>
        <KeyboardDoubleArrowLeft />
        <Box fontSize='16px'>Interactions</Box>
      </IconButton>
      <Popover
        id={id()}
        open={open()}
        anchorEl={anchorEl()}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Typography sx={{ p: 2 }}>
          <TableContainer component={Paper} sx={{ overflowY: 'scroll', height: '500px' }}>
            <Table aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>Function</TableCell>
                  <TableCell align='right'>Input</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <For each={rows}>
                  {(row, i) => (
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component='th' scope='row'>
                        {row.function}
                      </TableCell>
                      <TableCell align='right'>{row.input}</TableCell>
                    </TableRow>
                  )}
                </For>
              </TableBody>
            </Table>
          </TableContainer>
        </Typography>
      </Popover>
    </Box>
  );
};

export default Interactions;
