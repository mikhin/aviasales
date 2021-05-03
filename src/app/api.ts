import Ticket from './types/ticket';

export async function fetchSearchId(): Promise<string> {
  try {
    const response = await fetch('/search');

    const { searchId } = await response.json();

    return searchId;
  } catch (error) {
    throw error;
  }
}

export async function fetchTickets(searchId: string): Promise<[Array<Ticket>, boolean]> {
  try {
    const response = await fetch(`/tickets?searchId=${searchId}`);

    const { tickets, stop } = await response.json();

    return [tickets, stop];
  } catch (error) {
    throw error;
  }
}
