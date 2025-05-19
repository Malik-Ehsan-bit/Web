document.addEventListener('DOMContentLoaded', function() {
  const feedbackForm = document.getElementById('feedbackForm');
  const successMessage = document.getElementById('successMessage');

  feedbackForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('nameInput').value;
      const email = document.getElementById('emailInput').value;
      const message = document.getElementById('messageInput').value;
      
      // Here you would typically send the data to a server
      // For demonstration, we'll just show a success message
      console.log('Feedback submitted:', { name, email, message });
      
      // Show success message
      successMessage.classList.remove('d-none');
      
      // Reset form
      feedbackForm.reset();
      
      // Hide success message after 5 seconds
      setTimeout(() => {
          successMessage.classList.add('d-none');
      }, 5000);
  });

  // Animation for form elements
  const formElements = document.querySelectorAll('.form-control');
  formElements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'all 0.5s ease';
      
      setTimeout(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
      }, 100 * index);
  });
});