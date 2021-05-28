export const getFormattedTicketPrice = (price: number): string => price.toLocaleString().split(',').join(' ');
