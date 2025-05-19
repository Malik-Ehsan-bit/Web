$(document).ready(function () {
  // Toggle between login and signup
  $('#show-signup').click(() => {
    $('#login-form').addClass('d-none');
    $('#signup-form').removeClass('d-none');
  });

  $('#show-login').click(() => {
    $('#signup-form').addClass('d-none');
    $('#login-form').removeClass('d-none');
  });

  // Validation
  function validateForm($form) {
    let isValid = true;

    $form.find('input[required]').each(function () {
      const $input = $(this);
      const value = $input.val().trim();
      const $error = $input.siblings('small');

      if (!value) {
        $input.addClass('is-invalid');
        $error.removeClass('d-none');
        isValid = false;
      } else if (
        $input.attr('type') === 'email' &&
        !/^\S+@\S+\.\S+$/.test(value)
      ) {
        $input.addClass('is-invalid');
        $error.text('Please enter a valid email.').removeClass('d-none');
        isValid = false;
      } else if ($input.attr('type') === 'password' && value.length < 6) {
        $input.addClass('is-invalid');
        $error.text('Password must be at least 6 characters.').removeClass(
          'd-none'
        );
        isValid = false;
      } else {
        $input.removeClass('is-invalid');
        $error.addClass('d-none');
      }
    });

    return isValid;
  }

  // Signup Handler
  $('#signupForm').on('submit', function (e) {
    e.preventDefault();
    if (validateForm($(this))) {
      const fullname = $('[name="fullname"]').val();
      const email = $('[name="email"]:visible').val();
      const password = $('[name="password"]:visible').val();

      $('.btn-primary', this)
        .html(
          '<span class="spinner-border spinner-border-sm"></span> Creating account...'
        )
        .prop('disabled', true);

      fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullname, email, password }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            alert('Account created successfully! Please login.');
            $('#signup-form').addClass('d-none');
            $('#login-form').removeClass('d-none');
            $('#signupForm')[0].reset();
          }
        })
        .catch(() => alert('Signup failed'))
        .finally(() => {
          $('.btn-primary', '#signupForm').html('Sign Up').prop('disabled', false);
        });
    }
  });

  // Login Handler
  $('#loginForm').on('submit', function (e) {
    e.preventDefault();
    if (validateForm($(this))) {
      const email = $('[name="email"]:visible').val();
      const password = $('[name="password"]:visible').val();

      $('.btn-primary', this)
        .html(
          '<span class="spinner-border spinner-border-sm"></span> Logging in...'
        )
        .prop('disabled', true);

      fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            alert('Login successful!');
            window.location.href = 'admin.html'; 
          }
        })
        .catch(() => alert('Login failed'))
        .finally(() => {
          $('.btn-primary', '#loginForm').html('Login').prop('disabled', false);
        });
    }
  });

  // Real-time validation
  $('input').on('input', function () {
    const $input = $(this);
    const value = $input.val().trim();
    const $error = $input.siblings('small');

    if (value) {
      if (
        $input.attr('type') === 'email' &&
        !/^\S+@\S+\.\S+$/.test(value)
      ) {
        $input.addClass('is-invalid');
        $error.text('Please enter a valid email.').removeClass('d-none');
      } else if (
        $input.attr('type') === 'password' &&
        value.length < 6
      ) {
        $input.addClass('is-invalid');
        $error.text('Password must be at least 6 characters.').removeClass('d-none');
      } else {
        $input.removeClass('is-invalid');
        $error.addClass('d-none');
      }
    }
  });
});
