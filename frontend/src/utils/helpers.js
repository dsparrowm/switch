import moment from 'moment';

export function getLocalTime (dateTime) {
  const DateTime = new Date(dateTime)
  // return this.$moment(ScheduledTime).format('DD-MM-YYYY H:mm')
  return moment(DateTime);
};

export function groupByDate(data, field) {
  return data.reduce(function (rv, x) {
    (rv[x[field].split("T")[0]] = rv[x[field].split("T")[0]] || []).push(x);
    return rv;
  }, {});
};

export function stringToColor (string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function stringAvatar (name) {
  return {
    sx: {
      bgcolor: stringToColor(name)
    },
    variant: 'rounded',
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
  };
}

export function stringAvatarSmall (name, size) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      fontSize: '1rem',
      width: size,
      height: size
    },
    variant: 'rounded',
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
  };
}
