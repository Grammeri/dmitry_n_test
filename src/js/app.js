import { coursesData } from "./data.js";

console.log("App started");
console.log("Courses data:", coursesData);

// State for filters
let activeCategory = "All";
let activeSearch = "";

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

function applyFilters() {
  let result = coursesData;

  // Category filter
  if (activeCategory !== "All") {
    result = result.filter((c) => c.category === activeCategory);
  }

  // Search filter
  if (activeSearch.trim() !== "") {
    const q = activeSearch.toLowerCase();
    result = result.filter(
      (c) =>
        c.title.toLowerCase().includes(q) || c.author.toLowerCase().includes(q)
    );
  }

  renderCourses(result);
}

function renderCourses(list) {
  const grid = document.querySelector(".courses__grid");

  if (!grid) {
    console.error("Grid element not found!");
    return;
  }

  grid.innerHTML = "";

  list.forEach((course) => {
    const badgeClass = getBadgeClass(course.category);
    const isPlaceholder = course.img.includes("placeholder");
    const placeholderClass = isPlaceholder
      ? "course-card__image-wrapper--placeholder"
      : "";

    const cardHTML = `
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

    grid.insertAdjacentHTML("beforeend", cardHTML);
  });

  const images = grid.querySelectorAll(".course-card__image");
  images.forEach((img, index) => {
    const fullPath = new URL(img.src, window.location.href).href;
    console.log(`Image ${index + 1}: ${img.src} -> ${fullPath}`);
    img.addEventListener("error", (e) => {
      console.error(`Failed to load image ${index + 1}:`, img.src);
      console.error("Full URL:", fullPath);
      console.error("Error:", e);
    });
    img.addEventListener("load", () => {
      console.log(`✓ Loaded image ${index + 1}: ${img.src}`);
    });
  });

  console.log("Courses rendered:", list.length);
}

// Initialize filters and search
function initFilters() {
  const filtersContainer = document.querySelector(".courses__filters");

  if (!filtersContainer) {
    console.error("Filters container not found!");
    return;
  }

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
}

// Initialize app
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    renderCourses(coursesData);
    initFilters();
  });
} else {
  renderCourses(coursesData);
  initFilters();
}
