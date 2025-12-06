import { coursesData } from "./data.js";

console.log("App started");
console.log("Courses data:", coursesData);

// Load more state
let ITEMS_PER_LOAD = 9;
let visibleCount = ITEMS_PER_LOAD;

// State for filters
let activeCategory = "All";
let activeSearch = "";

// Get category counts
function getCategoryCounts() {
  const counts = { All: coursesData.length };

  coursesData.forEach((c) => {
    if (!counts[c.category]) counts[c.category] = 0;
    counts[c.category]++;
  });

  return counts;
}

const categoryCounts = getCategoryCounts();

function getBadgeClass(category) {
  if (category === "Marketing") return "badge--marketing";
  if (category === "Management") return "badge--management";
  if (category === "HR & Recruiting") return "badge--hr";
  if (category === "Design") return "badge--design";
  if (category === "Development") return "badge--development";
  return "";
}

// Filter functionality
function setActiveFilter(button) {
  document
    .querySelectorAll(".courses__filter-button")
    .forEach((btn) => btn.classList.remove("courses__filter-button_active"));
  button.classList.add("courses__filter-button_active");
}

function applyFilters(resetCount = true) {
  // Reset visible count when filters change (not on Load more)
  if (resetCount) {
    visibleCount = ITEMS_PER_LOAD;
  }

  let result = coursesData;

  // category filter
  if (activeCategory !== "All") {
    result = result.filter((c) => c.category === activeCategory);
  }

  // search filter
  if (activeSearch.trim() !== "") {
    const q = activeSearch.toLowerCase();
    result = result.filter(
      (c) =>
        c.title.toLowerCase().includes(q) || c.author.toLowerCase().includes(q)
    );
  }

  renderCards(result);
}

function createCardHTML(course) {
  const badgeClass = getBadgeClass(course.category);
  const isPlaceholder = course.img.includes("placeholder");
  const placeholderClass = isPlaceholder
    ? "course-card__image-wrapper--placeholder"
    : "";

  return `
    <article class="course-card">
      <div class="course-card__image-wrapper ${placeholderClass}">
        <img 
          src="${course.img}" 
          alt="" 
          class="course-card__image"
          loading="lazy"
        />
      </div>

      <div class="course-card__content">
        <span class="course-card__badge ${badgeClass}">
          ${course.category}
        </span>
        <h2 class="course-card__title">${course.title}</h2>

        <div class="course-card__meta">
          ${
            course.price !== null
              ? `<span class="course-card__price">$${course.price}</span><span class="course-card__separator">|</span>`
              : ""
          }
          <span class="course-card__author">${
            course.author === "—" ? course.author : `by ${course.author}`
          }</span>
        </div>
      </div>
    </article>
  `;
}

function renderCards(data) {
  const grid = document.querySelector(".courses__grid");

  if (!grid) {
    console.error("Grid element not found!");
    return;
  }

  grid.innerHTML = "";

  const limited = data.slice(0, visibleCount);

  limited.forEach((course, index) => {
    const html = createCardHTML(course);

    // добавляем fade-in анимацию
    const wrapper = document.createElement("div");
    wrapper.classList.add("fade-in-item");
    wrapper.style.animationDelay = `${index * 40}ms`;
    wrapper.innerHTML = html;

    grid.appendChild(wrapper);
  });

  const loadMoreBtn = document.querySelector(".courses__load-more");

  if (visibleCount >= data.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "flex";
  }

  console.log("Courses rendered:", limited.length, "of", data.length);
}

// Update filter buttons with counts
function updateFilterButtons() {
  const categoryNames = {
    All: "All",
    Marketing: "Marketing",
    Management: "Management",
    "HR & Recruiting": "HR & Recruiting",
    Design: "Design",
    Development: "Development",
  };

  const buttons = document.querySelectorAll(".courses__filter-button");

  buttons.forEach((btn) => {
    const category = btn.dataset.category;
    if (!category) return;

    const count = categoryCounts[category] || 0;
    const categoryName = categoryNames[category] || category;

    btn.innerHTML = `${categoryName} <sup>${count}</sup>`;
  });
}

// Initialize filters and search
function initFilters() {
  const filtersContainer = document.querySelector(".courses__filters");

  if (!filtersContainer) {
    console.error("Filters container not found!");
    return;
  }

  // Update buttons with counts
  updateFilterButtons();

  // Category filter click handler
  filtersContainer.addEventListener("click", (event) => {
    const btn = event.target.closest(".courses__filter-button");
    if (!btn) return;

    const category = btn.dataset.category;
    if (!category) return;

    activeCategory = category;
    setActiveFilter(btn);
    applyFilters();
  });

  // Search input handler
  const searchInput = document.querySelector(".search__input");

  if (!searchInput) {
    console.error("Search input not found!");
    return;
  }

  searchInput.addEventListener("input", () => {
    activeSearch = searchInput.value;
    applyFilters();
  });

  // Load more button handler
  const loadMoreBtn = document.querySelector(".courses__load-more");

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      visibleCount += ITEMS_PER_LOAD;
      applyFilters(false); // Don't reset count on Load more
    });
  }
}

// Initialize app
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    renderCards(coursesData);
    initFilters();
  });
} else {
  renderCards(coursesData);
  initFilters();
}
