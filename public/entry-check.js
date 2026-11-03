(() => {
  const started = Date.now();
  const container = document.getElementById('captcha');
  const status = document.getElementById('status');
  const retry = document.getElementById('retry');
  let widget;
  const fail = (message) => {
    status.textContent = message;
    retry.hidden = false;
  };
  retry.addEventListener('click', () => window.location.reload());
  window.mobileWorldCaptchaReady = () => {
    widget = window.turnstile.render(container, {
      sitekey: container.dataset.sitekey,
      action: 'site-entry',
      theme: 'light',
      'response-field': false,
      callback: async (token) => {
        status.textContent = 'Checking your response…';
        try {
          const response = await fetch('/__verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
            signal: AbortSignal.timeout(15000),
          });
          const result = await response.json();
          if (!response.ok || result.success !== true) throw new Error('Verification failed');
          status.textContent = 'Verified. Opening Mobile World…';
          setTimeout(() => window.location.reload(), Math.max(500, 2000 - (Date.now() - started)));
        } catch {
          fail('We could not verify your response. Please try again.');
          window.turnstile.reset(widget);
        }
      },
      'error-callback': () => fail('The security check could not load. Check your connection and try again.'),
      'expired-callback': () => {
        status.textContent = 'The check expired. Please complete it again.';
        window.turnstile.reset(widget);
      },
      'timeout-callback': () => fail('The security check timed out. Please try again.'),
    });
    status.textContent = 'Please complete the human verification above.';
  };
  const script = document.createElement('script');
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=mobileWorldCaptchaReady&render=explicit';
  script.async = true;
  script.onerror = () => fail('Cloudflare could not be reached. Check your connection and try again.');
  document.head.append(script);
})();
