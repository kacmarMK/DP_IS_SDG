import { format, parseISO, formatDistanceToNowStrict } from 'date-fns';
import { enUS, sk } from 'date-fns/locale';
import { useI18n } from 'vue-i18n';

const getLocalDate = (date: Date) => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
};

const formatToLocalTime = (val: string) => {
  if (!val) return '';
  const date = parseISO(val);
  const localDate = getLocalDate(date);
  return format(localDate, 'dd/MM/yyyy HH:mm:ss');
};

const formatTimeToDistance = (val: string) => {
  if (!val) return '';
  const date = parseISO(val);
  const localDate = getLocalDate(date);

  let locale;
  const i18n = useI18n();
  const localeCode = i18n.locale.value;

  if (localeCode === 'sk') {
    locale = sk;
  } else {
    locale = enUS;
  }

  return formatDistanceToNowStrict(localDate, { addSuffix: true, locale });
};

export { formatToLocalTime, formatTimeToDistance };
