import { Box, Button, FormControl, Stack, TextField, useTheme } from '@suid/material';
import { Component, Show, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Warp } from 'warp-contracts';

const Form: Component<{ wallet: any; warp: Warp | any }> = (props) => {
  const [form, setForm] = createStore({
    contractId: {
      value: '',
      error: '',
    },
    function: {
      value: '',
      error: '',
    },
    input: {
      value: '',
      error: '',
    },
  });
  const [submitting, setSubmitting] = createSignal(false);
  const [interactionError, setInteractionError] = createSignal('');

  const updateFormField = (fieldName: string) => (event: Event) => {
    const inputElement = event.currentTarget as HTMLInputElement;
    setForm({
      [fieldName]: {
        value: inputElement.value,
        error: '',
      },
    });
  };

  const handleFocus = (fieldName: string) => (event: Event) => {
    const oldFieldName = form[fieldName].value;
    setForm({
      [fieldName]: {
        value: '',
        error: '',
      },
    });
    setForm({
      [fieldName]: {
        value: oldFieldName,
        error: '',
      },
    });
  };

  const checkValid = () => {
    setForm({
      contractId: {
        ...form.contractId,
        error: '',
      },
      function: {
        ...form.function,
        error: '',
      },
      input: {
        ...form.input,
        error: '',
      },
    });

    Object.keys(form).forEach((k) => {
      if (k != 'wallet' && form[k].value == '') {
        setForm({
          [k]: {
            ...form[k],
            error: 'Please enter input',
          },
        });
      }
    });

    if (form.contractId.value && !isTxValid(form.contractId.value)) {
      setForm({
        ['contractId']: {
          ...form.contractId,
          error: 'Incorrect contract address',
        },
      });
    }

    let valid = true;

    Object.keys(form).forEach((k) => {
      if (form[k].error != '') {
        valid = false;
      }
    });
    return valid;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setSubmitting(true);
    const valid = checkValid();
    if (!valid) {
      return;
    }
    const contract = props.warp.contract(form.contractId.value);
    const test = { function: form.function.value, ...JSON.parse('{' + form.input.value + '}') };
    console.log(test);

    try {
      await contract
        .connect(props.wallet)
        .writeInteraction(
          { function: form.function.value, ...JSON.parse('{' + form.input.value + '}') },
          { strict: true }
        );
    } catch (e: any) {
      setInteractionError(e.message);
    }
  };

  const isTxValid = (txId: string) => {
    const validTxIdRegex = /[a-z0-9_-]{43}/i;
    return validTxIdRegex.test(txId);
  };

  const ErrorMessage: Component<{ error: string }> = (props) => (
    <Box sx={{ height: '15px', fontSize: '12px', color: '#FF2E2E' }}>{props.error}</Box>
  );

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} direction='column'>
        <Box>
          <TextField
            sx={{ minWidth: '500px' }}
            id='contract-id'
            label='Contract id'
            variant='standard'
            value={form.contractId.value}
            onChange={updateFormField('contractId')}
            onFocus={handleFocus('contractId')}
          />
          <Show when={form.contractId.error} fallback={<ErrorMessage error=''></ErrorMessage>}>
            <ErrorMessage error={form.contractId.error}></ErrorMessage>
          </Show>
        </Box>

        <Box>
          <TextField
            sx={{ minWidth: '500px' }}
            id='function'
            label='Function'
            variant='standard'
            value={form.function.value}
            onChange={updateFormField('function')}
            onFocus={handleFocus('function')}
          />
          <Show when={form.function.error} fallback={<ErrorMessage error=' '></ErrorMessage>}>
            <ErrorMessage error={form.function.error}></ErrorMessage>
          </Show>
        </Box>
        <Box>
          <TextField
            sx={{ minWidth: '500px' }}
            id='input'
            label='Input'
            variant='standard'
            value={form.input.value}
            onChange={updateFormField('input')}
            onFocus={handleFocus('input')}
            helperText='e.g. "id": 666, "user": "asia"'
          />
          <Show when={form.input.error} fallback={<ErrorMessage error=' '></ErrorMessage>}>
            <ErrorMessage error={form.input.error}></ErrorMessage>
          </Show>
        </Box>
        <Stack direction='row' justifyContent='flex-end'>
          <Button type='submit' variant='outlined' sx={{ width: '100px', marginLeft: 'auto' }}>
            Submit
          </Button>
        </Stack>
        <Stack direction='row' justifyContent='flex-end'>
          <Show
            when={submitting() && Object.keys(props.wallet).length == 0}
            fallback={<ErrorMessage error=' '></ErrorMessage>}
          >
            <ErrorMessage error='Please connect your wallet'></ErrorMessage>
          </Show>
          <Show when={interactionError()} fallback={<ErrorMessage error=' '></ErrorMessage>}>
            <ErrorMessage error={interactionError()}></ErrorMessage>
          </Show>
        </Stack>
      </Stack>
    </form>
  );
};

export default Form;
