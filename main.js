(function () {
  document.querySelectorAll('.year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('animateMotion').forEach(function (el) {
      el.remove();
    });
  }

  var roadSection = document.querySelector('.road-section');
  if (roadSection) {
    if ('IntersectionObserver' in window) {
      var roadObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-inview');
              roadObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.22 }
      );
      roadObserver.observe(roadSection);
    } else {
      roadSection.classList.add('is-inview');
    }
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
        'mailto:contact@zemoco.co.uk?subject=' +
        encodeURIComponent(subject) +
        '&body=' +
        encodeURIComponent(bodyLines);
    });
  }
})();
