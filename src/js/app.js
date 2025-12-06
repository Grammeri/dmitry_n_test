import { coursesData } from "./data.js";

console.log("App started");
console.log("Courses data:", coursesData);

// Load more state
let ITEMS_PER_LOAD = 9;
let visibleCount = ITEMS_PER_LOAD;

// State for filters
let activeCategory = "All";
let activeSearch = "";

// Filtered courses list
let filteredCourses = [...coursesData];

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
    .querySelectorAll(".categories__tab")
    .forEach((btn) => btn.classList.remove("categories__tab--active"));
  button.classList.add("categories__tab--active");
}

function applyFilters(resetCount = true) {
  // Reset visible count when filters change (not on Load more)
  if (resetCount) {
    visibleCount = ITEMS_PER_LOAD;
  }

  // Apply filters
  if (activeCategory === "All") {
    filteredCourses = [...coursesData];
  } else {
    filteredCourses = coursesData.filter((c) => c.category === activeCategory);
  }

  // Apply search filter
  if (activeSearch.trim() !== "") {
    const q = activeSearch.toLowerCase();
    filteredCourses = filteredCourses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) || c.author.toLowerCase().includes(q)
    );
  }

  renderCards(filteredCourses.slice(0, visibleCount));
  updateLoadMoreVisibility();
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
        <span class="course-card__badge badge ${badgeClass}">
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

function renderCards(list) {
  const grid = document.querySelector(".courses__grid");

  if (!grid) {
    console.error("Grid element not found!");
    return;
  }

  grid.innerHTML = "";

  list.forEach((course, index) => {
    const html = createCardHTML(course);

    // добавляем fade-in анимацию
    const wrapper = document.createElement("div");
    wrapper.classList.add("fade-in-item");
    wrapper.style.animationDelay = `${index * 40}ms`;
    wrapper.innerHTML = html;

    grid.appendChild(wrapper);
  });

  console.log("Courses rendered:", list.length);
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

  const buttons = document.querySelectorAll(".categories__tab");

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
  const categoriesContainer = document.querySelector(".categories");

  if (!categoriesContainer) {
    console.error("Categories container not found!");
    return;
  }

  // Update buttons with counts
  updateFilterButtons();

  // Category filter click handler
  categoriesContainer.addEventListener("click", (event) => {
    const btn = event.target.closest(".categories__tab");
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
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const spinner = document.querySelector(".spinner");

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      spinner.classList.remove("hidden");
      loadMoreBtn.classList.add("hidden");

      // имитация загрузки (как будто с сервера)
      setTimeout(() => {
        visibleCount += ITEMS_PER_LOAD;

        renderCards(filteredCourses.slice(0, visibleCount));
        updateLoadMoreVisibility();

        spinner.classList.add("hidden");
      }, 700);
    });
  }
}

// Управление видимостью кнопки
function updateLoadMoreVisibility() {
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  if (!loadMoreBtn) return;

  if (visibleCount >= filteredCourses.length) {
    loadMoreBtn.classList.add("hidden");
  } else {
    loadMoreBtn.classList.remove("hidden");
  }
}

// Initialize app
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    filteredCourses = [...coursesData];
    renderCards(filteredCourses.slice(0, visibleCount));
    updateLoadMoreVisibility();
    initFilters();
  });
} else {
  filteredCourses = [...coursesData];
  renderCards(filteredCourses.slice(0, visibleCount));
  updateLoadMoreVisibility();
  initFilters();
}
