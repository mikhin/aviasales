type Segment = {
  // Код города (iata)
  origin: string;
  // Код города (iata)
  destination: string;
  // Дата и время вылета туда
  date: string;
  // Массив кодов (iata) городов с пересадками
  stops: Array<string>;
  // Общее время перелёта в минутах
  duration: number;
}

export default Segment;
