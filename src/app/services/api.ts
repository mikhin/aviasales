import { Ticket } from 'app/types/ticket';

export async function fetchSearchId(): Promise<string> {
  try {
    const response = await fetch('/api/search');

    const { searchId } = await response.json();

    return searchId;
  } catch (error) {
    throw error;
  }
}

export async function fetchTickets(searchId: string): Promise<[Array<Ticket>, boolean]> {
  try {
    const response = await fetch(`/api/tickets?searchId=${searchId}`);

    const { tickets, stop } = await response.json();

    return [tickets, stop];
  } catch (error) {
    throw error;
  }
}