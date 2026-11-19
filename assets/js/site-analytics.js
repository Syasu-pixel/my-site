(() => {
  const host = window.location.hostname.toLowerCase();
  if (host !== 'denkicontrol.com' && host !== 'www.denkicontrol.com') return;
  if (window.__denkicontrolMetricoolLoaded) return;
  window.__denkicontrolMetricoolLoaded = true;

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = 'https://tracker.metricool.com/resources/be.js';
  script.onload = () => {
    if (window.beTracker && typeof window.beTracker.t === 'function') {
      window.beTracker.t({ hash: '9473079759614fc5d08dd0c060e59d7f' });
    }
  };
  script.onerror = () => {};
  document.head.appendChild(script);
})();
