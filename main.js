(function () {
  document.querySelectorAll('.year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('animateMotion').forEach(function (el) {
      el.remove();
    });
  }

  var qf = document.getElementById('quote-form');
  if (qf) {
    qf.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('name').value;
      var company = document.getElementById('company').value;
      var email = document.getElementById('email').value;
      var phone = document.getElementById('phone').value;
      var service = document.getElementById('service').value;
      var postcode = document.getElementById('postcode').value;
      var details = document.getElementById('details').value;

      var subject = 'Delivery quote request' + (service ? ' — ' + service : '');
      var bodyLines = [
        'Name: ' + name,
        company ? 'Company: ' + company : '',
        'Email: ' + email,
        phone ? 'Phone: ' + phone : '',
        'Service: ' + service,
        postcode ? 'Pickup postcode: ' + postcode : '',
        '',
        'Details:',
        details
      ].filter(Boolean).join('\n');

      window.location.href =
        'mailto:zemoco360@gmail.com?subject=' +
        encodeURIComponent(subject) +
        '&body=' +
        encodeURIComponent(bodyLines);
    });
  }
})();
