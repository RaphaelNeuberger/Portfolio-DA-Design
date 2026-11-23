/**
 * Project filter for the "My work" section.
 * Buttons carry data-filter, cards carry space-separated data-tags.
 */
document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".work-filter .filter-btn");
  const cards = document.querySelectorAll(".project-grid .project-card");
  const empty = document.querySelector(".work-empty");
  if (!buttons.length || !cards.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => applyFilter(btn.dataset.filter));
  });

  /**
   * Shows only cards matching the filter and updates button states.
   * @param {string} filter - "all" or a tag
   */
  function applyFilter(filter) {
    let visible = 0;
    cards.forEach((card) => {
      const tags = (card.dataset.tags || "").split(" ");
      const match = filter === "all" || tags.includes(filter);
      card.hidden = !match;
      if (match) visible++;
    });
    buttons.forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.filter === filter)),
    );
    if (empty) empty.hidden = visible > 0;
  }
});
