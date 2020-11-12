export { default } from './page';
export { default as Page__Main } from './__main';
export { default as Page__Section } from './__section';
export { default as Page__Sidebar } from './__sidebar';

require('./__content/page__content.scss');
require('./__header/page__header.scss');
require('./__main/page__main.scss');
require('./__section/page__section.scss');
require('./__sidebar/page__sidebar.scss');
require('./__trim/page__trim.scss');

require('./page.scss');
