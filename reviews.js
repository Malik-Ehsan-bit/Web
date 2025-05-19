document.addEventListener('DOMContentLoaded', function () {
  let currentRating = 0;
  const stars = document.querySelectorAll('.stars span');
  const ratingValue = document.getElementById('ratingValue');
  const reviewForm = document.getElementById('reviewForm');
  const reviewsContainer = document.getElementById('reviewsContainer');

  // Load existing reviews from server
  loadReviewsFromServer();

  stars.forEach(star => {
    star.addEventListener('click', () => {
      currentRating = parseInt(star.dataset.value);
      ratingValue.value = currentRating;
      updateStars();
    });
  });

  reviewForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (validateForm()) {
      const review = {
        name: document.getElementById('reviewerName').value,
        text: document.getElementById('reviewText').value,
        rating: currentRating,
        date: new Date().toLocaleDateString()
      };

      // Send review via AJAX
      fetch('/submit-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      })
        .then(res => res.text())
        .then(() => {
          addReviewToDisplay(review);
          reviewForm.reset();
          currentRating = 0;
          ratingValue.value = 0;
          updateStars();
          alert('Thank you for your review!');
        });
    }
  });

  function validateForm() {
    let isValid = true;
    const nameInput = document.getElementById('reviewerName');
    const reviewInput = document.getElementById('reviewText');

    if (!nameInput.value.trim()) {
      nameInput.classList.add('is-invalid');
      isValid = false;
    } else {
      nameInput.classList.remove('is-invalid');
    }

    if (!reviewInput.value.trim()) {
      reviewInput.classList.add('is-invalid');
      isValid = false;
    } else {
      reviewInput.classList.remove('is-invalid');
    }

    if (currentRating === 0) {
      document.querySelector('.star-rating').classList.add('is-invalid');
      isValid = false;
    } else {
      document.querySelector('.star-rating').classList.remove('is-invalid');
    }

    return isValid;
  }

  function updateStars() {
    stars.forEach(star => {
      star.classList.toggle('active', star.dataset.value <= currentRating);
    });
  }

  window.increaseRating = function () {
    if (currentRating < 5) {
      currentRating++;
      ratingValue.value = currentRating;
      updateStars();
    }
  };

  window.decreaseRating = function () {
    if (currentRating > 0) {
      currentRating--;
      ratingValue.value = currentRating;
      updateStars();
    }
  };

  function loadReviewsFromServer() {
    fetch('/get-reviews')
      .then(res => res.json())
      .then(reviews => {
        reviews.forEach(addReviewToDisplay);
      });
  }

  function addReviewToDisplay(review) {
    const reviewElement = document.createElement('div');
    reviewElement.className = 'review-item';
    reviewElement.innerHTML = `
      <div class="review-header">
        <span>${review.name}</span>
        <span class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
      </div>
      <div class="review-date">${review.date}</div>
      <div class="review-content">${review.text}</div>
    `;
    reviewsContainer.prepend(reviewElement);
  }
});
