import setStub from './stubs/set-stub';
import ticketsStub from './stubs/data/tickets';
import searchIdStub from './stubs/data/search-id';

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

    await page.goto('http://localhost:3001')
  });

  describe('На странице отображаются необходимые элементы раскладки', () => {
    it('На странице отображается логотип', async () => {
      await expect(page).toMatchElement('.logo')
    });

    it('На странице отображается фильтр', async () => {
      await expect(page).toMatchElement('.filter')
    });

    it('На странице отображается управление сортировкой', async () => {
      await expect(page).toMatchElement('.sorting-form')
    });

    it('На странице отображается список билетов', async () => {
      await expect(page).toMatchElement('.ticket-list')
    });
  });

  describe('Список билетов', () => {
    it('В списке отображается не более 5-ти билетов', async () => {
      const ticketCardSelector = '.ticket-card';

      await expect(page).toMatchElement(ticketCardSelector)
      const ticketsCount = await page.$$eval(ticketCardSelector, tickets => tickets.length);

      expect(ticketsCount).toBe(5);
    })

    it('Информация в карточке билета доступна для просмотра', async () => {
      await expect(page).toMatchElement('.ticket-card__price', { text: '15109' });
      await expect(page).toMatchElement('.ticket-card__company-logo');

      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .segment-route__detail_type_origin-destination .segment-route__detail-term', { text: 'MOW – HKT' });
      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .segment-route__detail_type_origin-destination .segment-route__detail-definition', { text: '15:07 – 06:40' });
      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .segment-route__detail_type_duration .segment-route__detail-definition', { text: '15ч 33м' });
      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .segment-route__detail_type_stops-count .segment-route__detail-term', { text: '1 пересадка' });
      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .segment-route__detail_type_stops-count .segment-route__detail-definition', { text: 'DXB' });

      await expect(page).toMatchElement('.ticket-card__route-segment:nth-child(2) .segment-route__detail_type_origin-destination .segment-route__detail-term', { text: 'HKT – MOW' });
      await expect(page).toMatchElement('.ticket-card__route-segment:nth-child(2) .segment-route__detail_type_origin-destination .segment-route__detail-definition', { text: '13:07 – 02:33' });
      await expect(page).toMatchElement('.ticket-card__route-segment:nth-child(2) .segment-route__detail_type_duration .segment-route__detail-definition', { text: '13ч 26м' });
      await expect(page).toMatchElement('.ticket-card__route-segment:nth-child(2) .segment-route__detail_type_stops-count .segment-route__detail-term', { text: 'Без пересадок' });
    });
  });

  describe('Сортировка', () => {
    const cheapestOptionId = 'cheapest';
    const fastestOptionId = 'fastest';

    it('По умолчанию отображается вариант «Самый дешевый»', async () => {
      await expect(page).toMatchElement(`#${cheapestOptionId}.sorting-form__input:checked`)
    });

    it('По умолчанию в адресной строке отображается вариант «Самый дешевый»', async () => {
      const urlSearchParams = await page.evaluate(() => window.location.search);
      expect(urlSearchParams).toContain(cheapestOptionId);
    });

    it('Выбор опции «Самый быстрый» меняет состояние сортировки', async () => {
      await page.click(`.sorting-form__label[for=${fastestOptionId}]`)

      await expect(page).toMatchElement(`#${fastestOptionId}.sorting-form__input:checked`)
    });

    it('Выбор опции «Самый быстрый» меняет состояние сортировки в адресной строке', async () => {
      await page.click(`.sorting-form__label[for=${fastestOptionId}]`)

      const urlSearchParams = await page.evaluate(() => window.location.search);
      expect(urlSearchParams).toContain(fastestOptionId);
    });

    it('Выбор опции «Самый быстрый» меняет поисковую выдачу', async () => {
      const fastestOptionId = 'fastest';
      await page.click(`.sorting-form__label[for=${fastestOptionId}]`)

      await expect(page).toMatchElement('.ticket-card__price', { text: '92922' });
      await expect(page).toMatchElement('.ticket-card__company-logo');

      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .segment-route__detail_type_origin-destination .segment-route__detail-term', { text: 'MOW – HKT' });
      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .segment-route__detail_type_origin-destination .segment-route__detail-definition', { text: '07:26 – 17:40' });
      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .segment-route__detail_type_duration .segment-route__detail-definition', { text: '10ч 14м' });
      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .segment-route__detail_type_stops-count .segment-route__detail-term', { text: '2 пересадки' });
      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .segment-route__detail_type_stops-count .segment-route__detail-definition', { text: 'AUH, SHA' });

      await expect(page).toMatchElement('.ticket-card__route-segment:nth-child(2) .segment-route__detail_type_origin-destination .segment-route__detail-term', { text: 'HKT – MOW' });
      await expect(page).toMatchElement('.ticket-card__route-segment:nth-child(2) .segment-route__detail_type_origin-destination .segment-route__detail-definition', { text: '04:24 – 14:46' });
      await expect(page).toMatchElement('.ticket-card__route-segment:nth-child(2) .segment-route__detail_type_duration .segment-route__detail-definition', { text: '10ч 22м' });
      await expect(page).toMatchElement('.ticket-card__route-segment:nth-child(2) .segment-route__detail_type_stops-count .segment-route__detail-term', { text: '3 пересадки' });
      await expect(page).toMatchElement('.ticket-card__route-segment:nth-child(2) .segment-route__detail_type_stops-count .segment-route__detail-definition', { text: 'HKG, DXB, IST' });
    });
  });

  describe('Фильтрация', () => {
    it('В форме «Количество пересадок» отображаются все опции', async () => {
      await expect(page).toMatchElement(`.checkbox-field__input#all`)
      await expect(page).toMatchElement(`.checkbox-field__input#without-stops`)
      await expect(page).toMatchElement(`.checkbox-field__input#stop-1`)
      await expect(page).toMatchElement(`.checkbox-field__input#stops-2`)
      await expect(page).toMatchElement(`.checkbox-field__input#stops-3`)
    });

    it('По умолчанию все опции активированы', async () => {
      await expect(page).toMatchElement(`.checkbox-field__input#all:checked`)
      await expect(page).toMatchElement(`.checkbox-field__input#without-stops:checked`);
      await expect(page).toMatchElement(`.checkbox-field__input#stop-1:checked`);
      await expect(page).toMatchElement(`.checkbox-field__input#stops-2:checked`);
      await expect(page).toMatchElement(`.checkbox-field__input#stops-3:checked`);
    });

    it('По умолчанию в адресной строке отображаются все опции', async () => {
      const urlSearchParams = await page.evaluate(() => window.location.search);

      expect(urlSearchParams).toContain('without-stops');
      expect(urlSearchParams).toContain('stop-1');
      expect(urlSearchParams).toContain('stops-2');
      expect(urlSearchParams).toContain('stops-3');
    });

    it('Деактивация опции «Все» производит деактивацию всех опций', async () => {
      await page.click('.checkbox-field__label[for="all"]');

      await expect(page).toMatchElement('.checkbox-field__input#without-stops:not(:checked)');
      await expect(page).toMatchElement('.checkbox-field__input#stop-1:not(:checked)');
      await expect(page).toMatchElement('.checkbox-field__input#stops-2:not(:checked)');
      await expect(page).toMatchElement('.checkbox-field__input#stops-3:not(:checked)');
    });

    it('Деактивация опции «Все» производит деактивацию всех опций в адресной строке', async () => {
      await page.click('.checkbox-field__label[for="all"]');

      const urlSearchParams = await page.evaluate(() => window.location.search);

      expect(urlSearchParams).not.toContain('without-stops');
      expect(urlSearchParams).not.toContain('stop-1');
      expect(urlSearchParams).not.toContain('stops-2');
      expect(urlSearchParams).not.toContain('stops-3');
    });

    it('Деактивация опции «Все» производит отображение предупреждения о пустой поисковой выдаче', async () => {
      await page.click('.checkbox-field__label[for="all"]');
      await expect(page).toMatchElement('.empty-search-results-message');
    });

    it('Деактивация любой опции кроме «Все» производит деактивацию опции «Все»', async () => {
      await page.click('.checkbox-field__label[for="stops-3"]')
      await expect(page).toMatchElement('.checkbox-field__input#all:not(:checked)');
    });

    it('Деактивация опции удаляет идентификатор опции из параметров в адресной строке', async () => {
      await page.click('.checkbox-field__label[for="stops-3"]')

      const urlSearchParams = await page.evaluate(() => window.location.search);

      expect(urlSearchParams).not.toContain('stops-3');
    });

    it('Деактивация опции меняет поисковую выдачу', async () => {
      await page.click('.checkbox-field__label[for="stop-1"]')

      await expect(page).toMatchElement('.ticket-card__price', { text: '15600' });
      await expect(page).toMatchElement('.ticket-card__company-logo');

      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .segment-route__detail_type_origin-destination .segment-route__detail-term', { text: 'MOW – HKT' });
      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .segment-route__detail_type_origin-destination .segment-route__detail-definition', { text: '20:44 – 01:21' });
      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .segment-route__detail_type_duration .segment-route__detail-definition', { text: '28ч 37м' });
      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .segment-route__detail_type_stops-count .segment-route__detail-term', { text: '2 пересадки' });
      await expect(page).toMatchElement('.ticket-card__route-segment:first-child .segment-route__detail_type_stops-count .segment-route__detail-definition', { text: 'SIN, HKG' });

      await expect(page).toMatchElement('.ticket-card__route-segment:nth-child(2) .segment-route__detail_type_origin-destination .segment-route__detail-term', { text: 'HKT – MOW' });
      await expect(page).toMatchElement('.ticket-card__route-segment:nth-child(2) .segment-route__detail_type_origin-destination .segment-route__detail-definition', { text: '18:06 – 12:49' });
      await expect(page).toMatchElement('.ticket-card__route-segment:nth-child(2) .segment-route__detail_type_duration .segment-route__detail-definition', { text: '18ч 43м' });
      await expect(page).toMatchElement('.ticket-card__route-segment:nth-child(2) .segment-route__detail_type_stops-count .segment-route__detail-term', { text: 'Без пересадок' });
    });
  });
});

// await page.screenshot({path: 'buddy-screenshot.png'});
