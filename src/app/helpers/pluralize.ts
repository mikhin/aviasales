export const pluralize = (n: number, one: string, few: string, many: string): string => {
  const selectedRule = new Intl.PluralRules('ru-RU').select(n);

  switch (selectedRule) {
    case 'one': {
      return one;
    }
    case 'few': {
      return few;
    }
  }

  return many;
};
