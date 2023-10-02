import React from 'react';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover, bindToggle } from 'material-ui-popup-state';
import Box from '@mui/material/Box';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#282e33',
      paper: '#282e33'
    },
    text: {
      primary: '#b6c2cf'
    }
  },
  // .css-3bmhjh-MuiPaper-root-MuiPopover-paper
  typography: {
    fontSize: 28
  }
});

const ICON_SMALL = 20;

export default function PopoverPopup ({ children, action, title }) {
  return (
    <ThemeProvider theme={theme}>
      <PopupState variant='popover' popupId='demo-popup-popover'>
        {(popupState) => (
          <div>
            <Button
              variant='contained'
              sx={{ width: '100%', justifyContent: 'flex-start', gap: '1rem' }}
              {...bindTrigger(popupState)}
            >
              {action}
            </Button>
            <Popover
              {...bindPopover(popupState)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center'
              }}
            >
              <Box
                sx={{ margin: 2, textAlign: 'center', position: 'relative' }}
              >
                <h5>{title}</h5>
                <Button
                  {...bindToggle(popupState)}
                  sx={{
                    position: 'absolute',
                    top: -5,
                    right: 0,
                    borderRadius: 100,
                    color: 'inherit',
                    padding: '1rem',
                    minWidth: 0,
                    width: 30,
                    height: 30
                  }}
                >
                  <ClearOutlinedIcon sx={{ width: ICON_SMALL, height: ICON_SMALL }} />
                </Button>
              </Box>
              <Box>
                {children}
              </Box>
            </Popover>
          </div>
        )}
      </PopupState>
    </ThemeProvider>
  );
}
