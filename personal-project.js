const accordionItems = document.querySelectorAll(".accordion-item");

accordionItems.forEach(item =>
  item.addEventListener("click", () => {
    const isItemOpen = item.classList.contains("open");
    accordionItems.forEach(item => item.classList.remove("open"));
    if (!isItemOpen) {
      item.classList.toggle("open");
    }
  })
);
document.addEventListener('DOMContentLoaded', function () {
  function initializeCarousel(carousel) {
      const dots = carousel.nextElementSibling?.querySelectorAll('.dot'); // Check if next sibling exists
      const carouselWrapper = carousel.querySelector('.carousel-wrapper');
      const carouselItems = carousel.querySelectorAll('.carousel-content');
      const totalItems = carouselItems.length;

      if (!dots || !carouselWrapper || totalItems === 0) return; // Prevent errors if elements are not found

      let currentIndex = 0;
      let startX, endX;
      let autoScrollInterval, autoScrollDelay = 5000, isInteracting = false, interactionTimeout;

      // Function to show the current item
      function showItem(index) {
          carouselWrapper.style.transition = 'transform 0.3s ease'; // Smooth transition
          carouselWrapper.style.transform = `translateX(-${index * 100}%)`;
          carouselItems.forEach((item, i) => {
              item.classList.remove('active');
              if (i === index) {
                  item.classList.add('active');
              }
          });
          dots.forEach(dot => dot.classList.remove('active'));
          dots[index].classList.add('active');
      }

      // Initialize the carousel
      showItem(currentIndex);

      // Dot click event
      dots.forEach((dot, index) => {
          dot.addEventListener('click', () => {
              currentIndex = index;
              showItem(currentIndex);
              resetAutoScroll(); // Reset auto-scroll on interaction
          });
      });

      // Swipe functionality for touch devices
      carousel.addEventListener('touchstart', (e) => {
          startX = e.touches[0].clientX;
          carouselWrapper.style.transition = 'none'; // Disable transition during swipe
          pauseAutoScroll(); // Pause auto-scroll when swiping
      });

      carousel.addEventListener('touchend', (e) => {
          endX = e.changedTouches[0].clientX;
          if (startX > endX + 50) {
              // Swiped left
              if (currentIndex < totalItems - 1) {
                  currentIndex++;
              }
          } else if (startX < endX - 50) {
              // Swiped right
              if (currentIndex > 0) {
                  currentIndex--;
              }
          }
          showItem(currentIndex);
          resetAutoScroll(); // Reset auto-scroll after interaction
      });

      // Prevent horizontal scrollbar appearance
      carousel.addEventListener('touchmove', (e) => {
          e.preventDefault(); // Prevent scrolling on touch devices
      });

      // Auto-scroll functionality
      function startAutoScroll() {
          autoScrollInterval = setInterval(() => {
              if (!isInteracting) {
                  currentIndex = (currentIndex + 1) % totalItems; // Go to the next slide
                  showItem(currentIndex);
              }
          }, autoScrollDelay);
      }

      function pauseAutoScroll() {
          isInteracting = true;
          clearInterval(autoScrollInterval); // Pause the auto-scroll
          clearTimeout(interactionTimeout); // Clear any pending timeout
      }

      function resetAutoScroll() {
          pauseAutoScroll();
          interactionTimeout = setTimeout(() => {
              isInteracting = false;
              startAutoScroll();
          }, autoScrollDelay);
      }

      // Start the auto-scroll when the page loads
      startAutoScroll();
  }

  // Initialize all carousels on the page
  document.querySelectorAll('.carousel').forEach(carousel => {
      if (carousel) { // Ensure the carousel exists
          initializeCarousel(carousel);
      }
  });
});