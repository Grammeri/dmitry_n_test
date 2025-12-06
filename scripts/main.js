import { coursesData } from "./data.js";

console.log("App started");
console.log("Courses data:", coursesData);

function getBadgeClass(category) {
  if (category === "Marketing") return "badge--marketing";
  if (category === "Management") return "badge--management";
  if (category === "HR & Recruiting") return "badge--hr";
  if (category === "Design") return "badge--design";
  if (category === "Development") return "badge--development";
  return "";
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

    const cardHTML = `
      <article class="course-card">
        <div class="course-card__image-wrapper">
          <img 
            src="${course.img}" 
            alt="${course.title}" 
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
            <span class="course-card__price">$${course.price}</span>
            <span class="course-card__separator">|</span>
            <span class="course-card__author">by ${course.author}</span>
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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    renderCourses(coursesData);
  });
} else {
  renderCourses(coursesData);
}
