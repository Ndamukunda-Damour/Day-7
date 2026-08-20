// ======================================================
// 1. MOBILE MENU TOGGLE
// ======================================================
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", function () {
  mainNav.classList.toggle("open");
});

// ======================================================
// 2. IMAGE SLIDESHOW (Products/Farms)
// ======================================================
const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

function showSlide(index) {
  slides.forEach((slide) => slide.classList.remove("active"));
  slides[index].classList.add("active");
}

document.getElementById("nextSlide").addEventListener("click", function () {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
});

document.getElementById("prevSlide").addEventListener("click", function () {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
});

// Auto-play the slideshow every 4 seconds
setInterval(function () {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}, 4000);

// ======================================================
// 3. PRODUCT FILTERING
// ======================================================
const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", function () {
    // Highlight the active filter button
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const filterValue = button.getAttribute("data-filter");

    productCards.forEach((card) => {
      if (filterValue === "all" || card.getAttribute("data-category") === filterValue) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// ======================================================
// 4. CONTACT FORM VALIDATION
// ======================================================
const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();
  let isValid = true;

  // Get input values
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const message = document.getElementById("message").value.trim();

  // Clear previous error messages
  document.getElementById("nameError").textContent = "";
  document.getElementById("emailError").textContent = "";
  document.getElementById("phoneError").textContent = "";
  document.getElementById("messageError").textContent = "";
  document.getElementById("successMsg").textContent = "";

  // Validate name
  if (name === "") {
    document.getElementById("nameError").textContent = "Please enter your full name.";
    isValid = false;
  }

  // Validate email using a simple pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    document.getElementById("emailError").textContent = "Please enter a valid email address.";
    isValid = false;
  }

  // Validate phone number (must be 10 digits, e.g. 0788123456)
  const phonePattern = /^[0-9]{10}$/;
  if (!phonePattern.test(phone)) {
    document.getElementById("phoneError").textContent = "Phone number must be 10 digits.";
    isValid = false;
  }

  // Validate message
  if (message === "") {
    document.getElementById("messageError").textContent = "Please enter your order details.";
    isValid = false;
  }

  // If everything is valid, show success message and reset form
  if (isValid) {
    document.getElementById("successMsg").textContent =
      "Thank you! Your request has been received.";
    contactForm.reset();
  }
});
