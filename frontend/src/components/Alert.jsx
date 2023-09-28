import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const styles = {
  maxWidth: '800px',
  width: '90%',
  margin: '0 auto',
  fontSize: 'var(--font-size-large)',

  alert: {
    fontSize: 'inherit',
    width: '100%'
  }
};

const Alert = React.forwardRef(function Alert (props, ref) {
  return <MuiAlert elevation={6} ref={ref} {...props} />;
});

function Toast ({ type, msg, isOpen }) {
  const [open, setOpen] = React.useState(false);

  const position = {
    vertical: 'top',
    horizontal: 'center'
  };

  const { vertical, horizontal } = position;

  React.useEffect(() => {
    if (isOpen) {
      setOpen(isOpen);
    }
  }, [isOpen]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Snackbar
        sx={styles}
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        key={vertical + horizontal}
      >
        <Alert
          onClose={handleClose}
          severity={type}
          sx={styles.alert}
        >
          {msg}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Toast;
