import { keyToCss } from './css_map.js';
import { onBaseContainerMutated } from './mutations.js';

const sidebarItems = Object.assign(document.createElement('div'), { id: 'xkit-sidebar' });

/**
 * @typedef {object} sidebarRowOptions
 * @property {string} label - Human-readable link text
 * @property {Function} onclick - Click event handler for this item
 * @property {string} [count] - Human-readable additional link text
 * @property {boolean} [carrot] - Whether to include a right-facing arrow on the link (ignored if count is specified)
 * @param {object} options - Destructured
 * @param {string} options.id - Unique ID for the sidebar item
 * @param {string} options.title - Human-readable sidebar item heading
 * @param {sidebarRowOptions[]} options.rows - Row options objects to construct clickable links in the sidebar item
 * @returns {HTMLDivElement} The constructed sidebar item, for future referencing
 */
export const addSidebarItem = function ({ id, title, rows }) {
  const sidebarItem = document.createElement('div');
  sidebarItem.classList.add('xkit-sidebar-item');
  sidebarItem.id = id;

  const sidebarTitle = document.createElement('h1');
  sidebarTitle.classList.add('xkit-sidebar-title');
  sidebarTitle.textContent = title;
  sidebarItem.appendChild(sidebarTitle);

  const sidebarList = document.createElement('ul');
  sidebarItem.appendChild(sidebarList);

  for (const row of rows) {
    const sidebarListItem = document.createElement('li');
    sidebarList.appendChild(sidebarListItem);

    const button = document.createElement('button');
    button.addEventListener('click', row.onclick);
    sidebarListItem.appendChild(button);

    const label = document.createElement('span');
    label.textContent = row.label;
    button.appendChild(label);

    if (row.count !== undefined) {
      const count = document.createElement('span');
      count.classList.add('count');
      count.textContent = row.count;
      button.appendChild(count);
    } else if (row.carrot === true) {
      const carrot = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      carrot.setAttribute('viewBox', '0 0 13 20.1');
      carrot.setAttribute('width', '12');
      carrot.setAttribute('height', '12');
      button.appendChild(carrot);

      const carrotPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      carrotPath.setAttribute('d', 'M0 2.9l7.2 7.2-7.1 7.1L3 20.1l7.1-7.1 2.9-2.9L2.9 0 0 2.9');
      carrot.appendChild(carrotPath);
    }
  }

  sidebarItems.appendChild(sidebarItem);
  return sidebarItem;
};

export const removeSidebarItem = id => sidebarItems.querySelector(`#${id}`)?.remove();

(async () => {
  const sidebarItemSelector = await keyToCss('sidebarItem');
  const navSubHeaderSelector = await keyToCss('navSubHeader');

  const addSidebarToPage = () => {
    if (document.body.contains(sidebarItems)) { return; }
    const outdatedSidebarItems = document.getElementById('xkit-sidebar');
    outdatedSidebarItems?.remove();

    const firstSidebarItem = document.querySelector(sidebarItemSelector);
    const firstNavSubHeader = document.querySelector(navSubHeaderSelector);

    if (firstSidebarItem) {
      const target = getComputedStyle(firstSidebarItem).position === 'sticky'
        ? firstSidebarItem
        : firstSidebarItem.nextElementSibling;
      firstSidebarItem.parentNode.insertBefore(sidebarItems, target);
    } else if (firstNavSubHeader) {
      firstNavSubHeader.parentNode.insertBefore(sidebarItems, firstNavSubHeader);
    }
  };

  onBaseContainerMutated.addListener(addSidebarToPage);
  addSidebarToPage();
})();
