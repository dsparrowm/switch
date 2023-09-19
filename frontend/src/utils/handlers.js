import moment from 'moment';

export function getLocalTime (dateTime) {
  const DateTime = new Date(dateTime)
  // return this.$moment(ScheduledTime).format('DD-MM-YYYY H:mm')
  return moment(DateTime);
}