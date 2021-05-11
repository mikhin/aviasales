import { setStub } from './stubs/set-stub';
import { ticketsStub } from './stubs/data/tickets';
import { searchIdStub } from './stubs/data/search-id';

describe('Страница поиска билетов', () => {
  beforeEach(async () => {
    await jestPuppeteer.resetPage();
    await page.setRequestInterception(true);

    page.on('request', (interceptedRequest): void => {
      if (interceptedRequest.url().includes('/search')) {
        setStub(interceptedRequest, searchIdStub);
      } else if (interceptedRequest.url().includes('/tickets')) {
        setStub(interceptedRequest, ticketsStub);
      } else {
        interceptedRequest.continue();
      }
    });

    await page.goto('http://localhost:3001');
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('На странице отображаются необходимые элементы раскладки', () => {
    it('На странице отображается логотип', async () => {
      await expect(page).toMatchElement('.logo');
    });

    it('На странице отображается фильтр', async () => {
      await expect(page).toMatchElement('.tickets-filter-form');
    });

    it('На странице отображается управление сортировкой', async () => {
      await expect(page).toMatchElement('.sorting-form');
    });

    it('На странице отображается список билетов', async () => {
      await expect(page).toMatchElement('.ticket-list');
    });

    it('На странице отображается кнопка «Показать ещё 5 билетов!»', async () => {
      await expect(page).toMatchElement('.page__section .button_theme_standard', { text: 'Показать ещё 5 билетов!' });
    });
  });

  describe('Список билетов', () => {
    it('В списке отображается не более 5-ти билетов', async () => {
      const ticketCardSelector = '.ticket-card';
      await expect(page).toMatchElement(ticketCardSelector);
      const ticketsCount = await page.$$eval(ticketCardSelector, tickets => tickets.length);
      expect(ticketsCount).toBe(5);
    });

    it('Информация в карточке билета доступна для просмотра', async () => {
      await expect(page).toMatchElement('.ticket-card__price', { text: '15 109' });
      await expect(page).toMatchElement('.ticket-card__company-logo');

      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .air-route-segment__detail_type_origin-destination .air-route-segment__detail-term', { text: 'MOW – HKT' });
      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .air-route-segment__detail_type_origin-destination .air-route-segment__detail-definition', { text: '15:07 – 06:40' });
      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .air-route-segment__detail_type_duration .air-route-segment__detail-definition', { text: '15ч 33м' });
      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .air-route-segment__detail_type_stops-count .air-route-segment__detail-term', { text: '1 пересадка' });
      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .air-route-segment__detail_type_stops-count .air-route-segment__detail-definition', { text: 'DXB' });

      await expect(page).toMatchElement('.ticket-card__route-segment:nth-child(2) .air-route-segment__detail_type_origin-destination .air-route-segment__detail-term', { text: 'HKT – MOW' });
      await expect(page).toMatchElement('.ticket-card__route-segment:nth-child(2) .air-route-segment__detail_type_origin-destination .air-route-segment__detail-definition', { text: '13:07 – 02:33' });
      await expect(page).toMatchElement('.ticket-card__route-segment:nth-child(2) .air-route-segment__detail_type_duration .air-route-segment__detail-definition', { text: '13ч 26м' });
      await expect(page).toMatchElement('.ticket-card__route-segment:nth-child(2) .air-route-segment__detail_type_stops-count .air-route-segment__detail-term', { text: 'Без пересадок' });
    });
  });

  describe('Сортировка', () => {
    const cheapestOptionId = 'cheapest';
    const fastestOptionId = 'fastest';

    it('По умолчанию отображается вариант «Самый дешевый»', async () => {
      await expect(page).toMatchElement(`#${cheapestOptionId}.sorting-form__input:checked`);
    });

    it('Выбор опции «Самый быстрый» меняет состояние сортировки', async () => {
      await page.click(`.sorting-form__label[for=${fastestOptionId}]`);

      await expect(page).toMatchElement(`#${fastestOptionId}.sorting-form__input:checked`);
    });

    it('Выбор опции «Самый быстрый» меняет поисковую выдачу', async () => {
      await page.click(`.sorting-form__label[for=${fastestOptionId}]`);

      await expect(page).toMatchElement('.ticket-card__price', { text: '92 922' });
      await expect(page).toMatchElement('.ticket-card__company-logo');

      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .air-route-segment__detail_type_origin-destination .air-route-segment__detail-term', { text: 'MOW – HKT' });
      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .air-route-segment__detail_type_origin-destination .air-route-segment__detail-definition', { text: '07:26 – 17:40' });
      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .air-route-segment__detail_type_duration .air-route-segment__detail-definition', { text: '10ч 14м' });
      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .air-route-segment__detail_type_stops-count .air-route-segment__detail-term', { text: '2 пересадки' });
      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .air-route-segment__detail_type_stops-count .air-route-segment__detail-definition', { text: 'AUH, SHA' });

      await expect(page).toMatchElement('.ticket-card__route-segment:nth-child(2) .air-route-segment__detail_type_origin-destination .air-route-segment__detail-term', { text: 'HKT – MOW' });
      await expect(page).toMatchElement('.ticket-card__route-segment:nth-child(2) .air-route-segment__detail_type_origin-destination .air-route-segment__detail-definition', { text: '04:24 – 14:46' });
      await expect(page).toMatchElement('.ticket-card__route-segment:nth-child(2) .air-route-segment__detail_type_duration .air-route-segment__detail-definition', { text: '10ч 22м' });
      await expect(page).toMatchElement('.ticket-card__route-segment:nth-child(2) .air-route-segment__detail_type_stops-count .air-route-segment__detail-term', { text: '3 пересадки' });
      await expect(page).toMatchElement('.ticket-card__route-segment:nth-child(2) .air-route-segment__detail_type_stops-count .air-route-segment__detail-definition', { text: 'HKG, DXB, IST' });
    });
  });

  describe('Фильтрация', () => {
    it('В форме «Количество пересадок» отображаются все опции', async () => {
      await expect(page).toMatchElement('.checkbox-field__input#all');
      await expect(page).toMatchElement('.checkbox-field__input#stops-0');
      await expect(page).toMatchElement('.checkbox-field__input#stops-1');
      await expect(page).toMatchElement('.checkbox-field__input#stops-2');
      await expect(page).toMatchElement('.checkbox-field__input#stops-3');
    });

    it('По умолчанию все опции активированы', async () => {
      await expect(page).toMatchElement('.checkbox-field__input#all:checked');
      await expect(page).toMatchElement('.checkbox-field__input#stops-0:checked');
      await expect(page).toMatchElement('.checkbox-field__input#stops-1:checked');
      await expect(page).toMatchElement('.checkbox-field__input#stops-2:checked');
      await expect(page).toMatchElement('.checkbox-field__input#stops-3:checked');
    });

    it('Деактивация опции «Все» производит деактивацию всех опций', async () => {
      await page.waitForResponse(response => response.url().includes('api/tickets') && response.status() === 200);

      await page.click('.checkbox-field__label[for="all"]');

      await expect(page).toMatchElement('.checkbox-field__input#stops-0:not(:checked)');
      await expect(page).toMatchElement('.checkbox-field__input#stops-1:not(:checked)');
      await expect(page).toMatchElement('.checkbox-field__input#stops-2:not(:checked)');
      await expect(page).toMatchElement('.checkbox-field__input#stops-3:not(:checked)');
    });

    it('Деактивация опции «Все» производит отображение предупреждения о пустой поисковой выдаче', async () => {
      await page.waitForResponse(response => response.url().includes('api/tickets') && response.status() === 200);

      await page.click('.checkbox-field__label[for="all"]');
      await expect(page).toMatchElement('.empty-search-results-message');
    });

    it('Деактивация любой опции кроме «Все» производит деактивацию опции «Все»', async () => {
      await page.waitForResponse(response => response.url().includes('api/tickets') && response.status() === 200);

      await page.click('.checkbox-field__label[for="stops-3"]');
      await expect(page).toMatchElement('.checkbox-field__input#all:not(:checked)');
    });

    it('Деактивация опции меняет поисковую выдачу', async () => {
      await page.waitForResponse(response => response.url().includes('api/tickets') && response.status() === 200);

      await page.click('.checkbox-field__label[for="stops-1"]');

      await expect(page).toMatchElement('.ticket-card__price', { text: '15 600' });
      await expect(page).toMatchElement('.ticket-card__company-logo');

      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .air-route-segment__detail_type_origin-destination .air-route-segment__detail-term', { text: 'MOW – HKT' });
      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .air-route-segment__detail_type_origin-destination .air-route-segment__detail-definition', { text: '20:44 – 01:21' });
      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .air-route-segment__detail_type_duration .air-route-segment__detail-definition', { text: '28ч 37м' });
      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .air-route-segment__detail_type_stops-count .air-route-segment__detail-term', { text: '2 пересадки' });
      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .air-route-segment__detail_type_stops-count .air-route-segment__detail-definition', { text: 'SIN, HKG' });

      await expect(page).toMatchElement('.ticket-card__route-segment:nth-child(2) .air-route-segment__detail_type_origin-destination .air-route-segment__detail-term', { text: 'HKT – MOW' });
      await expect(page).toMatchElement('.ticket-card__route-segment:nth-child(2) .air-route-segment__detail_type_origin-destination .air-route-segment__detail-definition', { text: '18:06 – 12:49' });
      await expect(page).toMatchElement('.ticket-card__route-segment:nth-child(2) .air-route-segment__detail_type_duration .air-route-segment__detail-definition', { text: '18ч 43м' });
      await expect(page).toMatchElement('.ticket-card__route-segment:nth-child(2) .air-route-segment__detail_type_stops-count .air-route-segment__detail-term', { text: 'Без пересадок' });
    });
  });

  it('Клик по кнопке «Показать ещё 5 билетов!» добавляет еще 5 билетов в выдачу', async () => {
    await expect(page).toClick('.page__section .button_theme_standard', { text: 'Показать ещё 5 билетов!' });

    const ticketCardSelector = '.ticket-card';
    const ticketsCount = await page.$$eval(ticketCardSelector, tickets => tickets.length);
    expect(ticketsCount).toBe(10);
  });
});
