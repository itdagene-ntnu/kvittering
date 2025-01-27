import React, { useState } from 'react';
import { Typography, Button, Paper, CircularProgress } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Alert from '@mui/lab/Alert';

import Input from './Input';
import PictureUpload from './PictureUpload';
import SignatureUpload from './SignatureUpload';

import styles from './Form.module.css';

const Form = (): JSX.Element => {
  // Get today
  const today = new Date().toISOString().split('T')[0].toString();

  // Hooks for each field in the form
  const [images, setImages] = useState<Array<string>>([]);
  const [date, setDate] = useState(today);
  const [occasion, setOccasion] = useState('');
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');
  const [mailto, setMailto] = useState('');
  const [signature, setSignature] = useState('');
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [mailfrom, setMailfrom] = useState('');

  // Hooks for submittion
  const [submitting, setSumbitting] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  // The body object sendt to the backend
  const formBody = {
    images,
    date,
    occasion,
    amount,
    comment,
    mailto,
    signature,
    name,
    group,
    accountNumber,
    mailfrom,
  };

  const Response = (): JSX.Element => (
    <div className={styles.response}>
      {/* We have submitted the request, but gotten no response */}
      {submitting && <CircularProgress />}
      {/* We have submitted the request, and gotten succes back */}
      {success == true && <Alert severity="success">{response}</Alert>}
      {/* We have submitted the request, and gotten failure back */}
      {success == false && <Alert severity="error">{response}</Alert>}
    </div>
  );

  return (
    <Paper elevation={3} className={styles.card}>
      <Typography
        variant="h4"
        style={{ width: '100%', textAlign: 'center', marginBottom: '1em' }}
      >
        Kvitteringsskjema
      </Typography>
      <Input
        id="name"
        name="Navn"
        value={name}
        required
        updateForm={setName}
        helperText="Ditt fulle navn, slik kvitteringen viser"
      />
      <Input
        id="mailFrom"
        name="Din epost"
        value={mailfrom}
        required
        updateForm={setMailfrom}
        helperText="Din kopi av skjema går hit"
      />
      <Input
        id="group"
        name="Gruppe"
        value={group}
        updateForm={setGroup}
        helperText={'Hvilken gruppe du tilhører'}
      />
      <Input
        id="mailTo"
        name="Økonomiansvarlig"
        value="okonomi@itdagene.no"
        disabled
        updateForm={setMailto}
      />
      <Input
        id="accountNumber"
        name="Kontonummer"
        value={accountNumber}
        required
        type="number"
        updateForm={setAccountNumber}
        helperText="Pengene overføres til denne kontoen"
      />
      <Input
        id="amount"
        name="Beløp"
        value={amount}
        required
        type="number"
        updateForm={setAmount}
        adornment={'kr'}
        helperText="Beløpet du ønsker refundert"
      />
      <Input
        id="date"
        name="Kjøpsdato"
        value={date}
        required
        type="date"
        updateForm={setDate}
        helperText="Helst samme som på kvittering"
      />
      <Input
        id="occasion"
        name="Anledning"
        value={occasion}
        updateForm={setOccasion}
        helperText="I hvilken anledning du har lagt ut"
      />
      <Input
        id="comment"
        name="Kommentar"
        multiline
        fullWidth
        value={comment}
        updateForm={setComment}
        helperText="Fyll inn ekstra informasjon hvis nødvendig"
      />
      <SignatureUpload updateForm={setSignature} setSignature={setSignature} />
      <PictureUpload updateForm={setImages} />
      <Response />
      <Button
        variant="contained"
        color="primary"
        disabled={submitting || success == true}
        style={{ width: '100%', marginTop: '3em' }}
        className={styles.fullWidth}
        onClick={() => {
          // Reset server response
          setResponse(null);
          setSuccess(null);
          setSumbitting(true);

          // POST full body to the backend
          fetch(`${process.env.API_URL || ''}/kaaf`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formBody),
          })
            .then((res) => {
              if (!res.ok) {
                setSuccess(false);
              } else {
                setSuccess(true);
              }
              setSumbitting(false);
              return res.text();
            })
            .then((text) => {
              setResponse(text);
            })
            .catch((err) => {
              setResponse(`Error: ${err.text()}`);
              setSumbitting(false);
            });
        }}
      >
        <ReceiptIcon style={{ marginRight: '10px' }} />
        <Typography variant="h6">Generer Kvittering</Typography>
      </Button>
    </Paper>
  );
};

export default Form;
