import React, { useState } from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

function TaskDueDatePicker ({ taskId }) {
  const [value, setValue] = useState(dayjs());

  console.log(value);
  console.log(dayjs(value).format('DD/MM/YYYY'));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <DateCalendar value={value} onChange={(newValue) => setValue(newValue)} />

        <Stack
          direction='row'
          justifyContent='space-around'
          alignItems='center'
          mt={2}
          mb={2}
        >
          <Button
            variant='contained'
            sx={{ textTransform: 'none' }}
          >
            Save
          </Button>
          <Button
            variant='contained'
            sx={{
              bgcolor: '#e3f2fd',
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#e3f2fd',
                opacity: 0.8
              }
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
}

export default TaskDueDatePicker;
