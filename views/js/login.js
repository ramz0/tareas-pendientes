const API_LOGIN = 'http://localhost:4545/auth/login';

$(document).ready(function () {
  $('#login-form').submit(function (e) {
    e.preventDefault();

    const email = $('#email').val().trim();
    const password = $('#password').val().trim();

    if (!email || !password) {
      alert('Por favor completa todos los campos');
      return;
    }

    $.ajax({
      url: API_LOGIN,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ email, password }),
      success: function (data) {
        localStorage.setItem('token', data.token);
        window.location.href = 'index.html'; // Redirige a index.html
      },
      error: function (xhr) {
        const msg = xhr.responseJSON?.error || 'Error al iniciar sesión';
        alert(msg);
      }
    });
  });
});
