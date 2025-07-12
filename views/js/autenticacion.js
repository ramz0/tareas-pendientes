const API_LOGIN_URL = 'http://localhost:4545/auth/login';

$(document).ready(function () {
  $('#login-form').submit(function (e) {
    e.preventDefault();
    
    const email = $('#email').val().trim();
    const password = $('#password').val().trim();

    $.ajax({
      url: API_LOGIN_URL,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ email, password }),
      success: function (response) {
        localStorage.setItem('token', response.token);
        window.location.href = 'index.html';  // Redirige al dashboard
      },
      error: function () {
        $('#mensaje-error').text('Correo o contraseña incorrectos');
      }
    });
  });
});
