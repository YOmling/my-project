const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".menu__list");
const links = document.querySelectorAll(".menu__list li");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});