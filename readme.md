# Aviasales

[![ci](https://github.com/mikhin/aviasales/actions/workflows/ci.yml/badge.svg)](https://github.com/mikhin/aviasales/actions/workflows/ci.yml)

## Демо
https://aviasales-demo.netlify.app/

## Исходные данные
* Постановка задачи — https://github.com/KosyanMedia/test-tasks/tree/master/aviasales_frontend
* Документация к серверу — https://github.com/KosyanMedia/test-tasks/blob/master/aviasales_frontend/server.md

## Запуск приложения
- установить зависимости приложения, запустив команду `npm i`;
- запустить приложение — команда `npm start`;
- запуск тестов — команда `npm test`;
- запуск линтеров:
    - проверка код-стайла стилей — команда `lint:scss`;
    - проверка код-стайла скриптов и компонентов React — команда `lint:ts`;
- продакшн-сборка приложения — команда `npm run build`.

## Применяемый стек технологий
Данное приложение — SPA, написанное на [Typescript](https://www.typescriptlang.org/) с использованием библиотеки [React](https://ru.reactjs.org/). Для Typescript использованы строгие настройки (strict-режим).

Для быстрого начала разработки использован шаблон [«Create react app»](https://create-react-app.dev/).

Для стилизации используется препроцессор [Sass](https://sass-lang.com/). Sass используется для упрощения написания кода стилей (более удобное написание медиа-выражений, использование миксинов). В качестве синтаксиса использован SCSS, как наиболее близкий к CSS.

В тестах используются библиотеки [Jest](https://jestjs.io/ru/) (для запуска тестов) и [Puppeteer](https://pptr.dev/) (для автоматизации работы с браузером).

### Линтеры
#### Eslint
Для проверки код-стайла скриптов и компонентов React  используется библиотека [Eslint](https://eslint.org/).

В качестве конфигурации используются:
- стандартная конфигурация «Create react app»;
- стандартная конфигурация Eslint для Typescript;
- корпоративная [конфигурация компании Funbox](https://github.com/funbox/eslint-config).

В качестве парсера Eslint используется [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint#readme). В качестве настроек парсера используется основной файл настроек Typescript.

#### Stylelint
Для проверки код-стайла стилей используется библиотека [Stylelint](https://stylelint.io/). В качестве конфигурации используются стандартная конфигурация Stylelint и [конфигурация Airbnb](https://www.npmjs.com/package/stylelint-config-airbnb).

### Используемые библиотеки
- [bem-react-helper](https://github.com/igoradamenko/bem-react-helper) — для установки значений БЭМ-модификаторов и БЭМ-миксов;
- [date-fns](https://date-fns.org/) — для форматирования даты и времени;
- [date-fns-tz](https://www.npmjs.com/package/date-fns-tz) — для конвертации UTC времени в локальный часовой пояс;
- [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) — для настройки proxy при обращении к серверу API.

### Тесты
Для приложения написаны интеграционные автотесты, проверяющие работоспособность интерфейса и всего приложения в целом.

Для упрощенного управления браузером используется библиотека [jest-puppeteer](https://github.com/smooth-code/jest-puppeteer).

В тестах используется установка моковых значений для эмуляции ответа от сервера бэкенда. Для текущего приложения в тестах эмулируются значения поискового ID и значения списка билетов.

### CI
В качестве CI используется сервис [«Github Actions»](https://github.com/mikhin/aviasales/actions).

На каждый пуш в мастер-ветку на CI выполняются:
- проверка код-стайла стилей и скриптов;
- запуск интеграционных автотестов;
- продакшн-сборка приложения.

В качестве рабочего окружения используются последняя версия ОС Ubuntu и Node JS версии 12.

### Деплой
Проект задеплоен при помощи сервиса [Netlify](https://www.netlify.com/).

## Описание работы приложения
При первоначальной загрузке приложения совершается два сетевых запроса к бэкенд-серверу: для получения поискового ID и для получения списка билетов. Запросы совершаются последовательно: сначала выполняется запрос за поисковым ID и только потом совершается запрос за списком билетов.

Для каждого сетевого запроса действует политика «retry» — в случае получения ошибки, запрос происходит заново. В случае, если превышено максимальное количество попыток, в интерфейсе устанавливается состояние ошибки.

Т.к. необходимо сделать несколько сетевых запросов, чтобы получить полный список билетов, для интерфейса устанавливается следующая логика: пока никакие билеты не загружены, пользователь видит интерфейсный элемент-загрузчик для фильтра билетов, означающий загрузку данных. Это происходит потому, что опции фильтра формируются динамически — в зависимости от возможных вариантов пересадок для всего списка билетов.

Как только первые билеты получены, они сразу выводятся на экран, при этом сетевые запросы за остальными билетами продолжают происходить, но видимый список для пользователя при этом не изменяется. Такое поведение нужно, чтобы список билетов не “прыгал”, так как, вероятно, пользователь уже приступил к изучению первых полученных билетов.

В то время, пока продолжают идти запросы за билетами, пользователь каждый раз может получить доступ к обновленному списку билетов — для этого он может изменить варианты фильтрации или опцию сортировки.

### Хранилище билетов
Хранилище билетов — это JS-класс для хранения данных билетов, который также реализует методы для работы с этими данными. Основные «отсеки» хранилища это 3 свойства-массива, где хранятся билеты, отсортированные по разным критериям: по цене, по продолжительности полета, по оптимальности двух первых критериев.

#### Критерий длительности полета
Длительность полета для билета — это суммарная длительность полетов в обоих направлениях для каждого билета.

#### Сортировка по продолжительности
При сортировке по продолжительности полёта мы устанавливаем общую длительность полета билета как индекс массива. Значением при этом является список билетов с такой общей продолжительностью полета. Таким образом мы получаем список билетов отсортированных от меньшей продолжительности полёта к большей.

#### Сортировка по цене
Сортировка по цене происходит аналогично сортировке по продолжительности полета — цена билета устанавливается  как индекс массива. Значением при этом является список билетов с этой ценой. Таким образом мы получаем список билетов отсортированных от меньшей стоимости к большей.

#### Сортировка по оптимальности
Массив билетов, отсортированных по оптимальности формируется на основе двух предыдущих массивов, где билеты отсортированы по цене и продолжительности полета.
Используется следующая логика: так как каждому билету в предыдущих хранилищах установлен порядковый индекс, который отражает меру его оптимальности, можно считать, что сумма этих двух индексов является общей мерой оптимальности для каждого билета.

#### Кэширование результатов фильтрации
Операция фильтрации билетов — это дорогостоящая операция с точки зрения вычислительных ресурсов, поэтому с целью экономии ресурсов применим методику кэширования.
Методика заключается в следующем: создаётся массив, содержащий объекты, в каждом из которых хранится «ключ» сортировки и значение — список билетов для отображения. Ключом сортировки является сочетание установленного фильтра пересадок и установленного типа сортировки.
Таким образом, с точки зрения пользователя, дорогостоящая операция фильтрации не происходит повторно, если её результаты уже были получены ранее.

### Адаптивная вёрстка
Вёрстка приложения адаптирована под минимальную ширину мобильных устройств — 320 пикселей.

### Ретинизация
Для логотипов партнеров реализована ретинизация изображений.

### Мета-данные веб-приложения
Установлены мета-данные реального приложения в продакшене (мета-теги в HTML и фавиконки).

### A11y
Для интерактивных элементов реализовано управление фокусным состоянием с клавиатуры.

### I18n
Для отображения правильных форм склонений слов по правилам русского языка используется хелпер `pluralize`, использующий внутри себя [объект Intl](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Intl) (API интернационализации ECMAScript).

### Файловая структура приложения
Основной исходный код приложения поделен на следующие части:
- БЭМ блоки (компоненты React);
- общие константы приложения;
- функции-хелперы;
- сервисы;
- общие типы приложения;
- страницы (вьюхи);
- тесты.

### БЭМ
При разработке приложения использовалась [методология БЭМ](https://ru.bem.info/methodology/).

### Компоненты
В соответствии с философией React и БЭМ, интерфейс приложения разделен на независимые компоненты. По БЭМ каждый компонент отвечает только за одну интерфейсную функцию. Вся реализация скрыта внутри блока, а снаружи доступен только интерфейс блока — в терминах React это свойства компонента.

С точки зрения файловой системы, файлы разметки и стилей для каждого блока, элемента и модификатора лежат в отдельной директории. Это улучшает читабельность исходного кода разметки и стилей для всех частей компонента.

### Экспортный файл БЭМ блока `index.js`
Каждый компонент доступен для импорта только через свой экспортный файл `index.js`. В этом файле подключаются все необходимые составляющие блока: основной React-компонент, стили компонента, дочерние компоненты.

## Композиция компонентов
Для того чтобы минимизировать потенциальные ошибки при разработке компонентов принято следующее правило составления композиции компонентов: каждый компонент можно использовать только через тот интерфейс, который он предоставляет и никак иначе. В терминах React это означает, что древо компонентов можно составлять только из тех элементов, которые экспортирует сам блок.

Никакая частная разметка с классами этого блока недопустима.

Пример для компонента страницы списка билетов `tickets.tsx`:

_Нельзя_
```
{areTicketsLoading && (
    <section className="page__section">
        <LineThrobber caption="Загрузка билетов"/>
    </section>
)}
```

_Можно_
```
{areTicketsLoading && (
    <Page__Section>
        <LineThrobber caption="Загрузка билетов"/>
    </Page__Section>
)}
```

## «Межблочный каскад»
Так называемый «межблочный каскад» при составлении селекторов CSS запрещен:

_Нельзя_
```
.page .logo {
  ...
}
```
