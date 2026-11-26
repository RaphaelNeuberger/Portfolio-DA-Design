/**
 * Project filter for the "My work" section.
 * Buttons carry data-filter, cards carry space-separated data-tags.
 */


/**
 * Checks whether a project card belongs to the selected filter.
 * @param {HTMLElement} card - project card
 * @param {string} filter - "all" or a tag
 * @returns {boolean}
 */
function cardMatchesFilter(card, filter) {
  const tags = (card.dataset.tags || "").split(" ");
  return filter === "all" || tags.includes(filter);
}


/**
 * Shows only cards matching the filter and updates button states.
 * @param {string} filter - "all" or a tag
 */
function applyFilter(filter) {
  let visible = 0;
  document.querySelectorAll(".project-grid .project-card").forEach((card) => {
    card.hidden = !cardMatchesFilter(card, filter);
    if (!card.hidden) visible++;
  });
  document.querySelectorAll(".work-filter .filter-btn").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.filter === filter));
  });
  const empty = document.querySelector(".work-empty");
  if (empty) empty.hidden = visible > 0;
}


/**
 * Binds the filter buttons.
 */
function initWorkFilter() {
  document.querySelectorAll(".work-filter .filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => applyFilter(btn.dataset.filter));
  });
}


document.addEventListener("DOMContentLoaded", initWorkFilter);
