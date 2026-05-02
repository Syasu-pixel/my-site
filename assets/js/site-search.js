(() => {
  const root = document.getElementById('siteSearch');
  if (!root) return;

  const input = document.getElementById('site-search-input');
  const panel = document.getElementById('site-search-panel');
  const resultsList = document.getElementById('site-search-results');
  const emptyMessage = document.getElementById('site-search-empty');

  if (!input || !panel || !resultsList || !emptyMessage) return;

  const MIN_QUERY_LENGTH = 2;
  const MAX_RESULTS = 6;

  let indexEntries = [];
  let currentResults = [];
  let activeIndex = -1;

  const normalize = (value) => (value || '').toString().trim().toLowerCase();

  const toSearchText = (entry) => {
    const fields = [
      entry.title,
      entry.category,
      entry.description,
      ...(Array.isArray(entry.keywords) ? entry.keywords : []),
      ...(Array.isArray(entry.synonyms) ? entry.synonyms : [])
    ];

    return fields.map(normalize).join(' ');
  };

  const scoreEntry = (entry, query) => {
    const title = normalize(entry.title);
    const category = normalize(entry.category);
    const description = normalize(entry.description);
    const keywords = (Array.isArray(entry.keywords) ? entry.keywords : []).map(normalize);
    const synonyms = (Array.isArray(entry.synonyms) ? entry.synonyms : []).map(normalize);
    const haystack = entry._searchText;

    if (!haystack.includes(query)) return -1;

    let score = 0;

    if (title === query) score += 150;
    else if (title.startsWith(query)) score += 110;
    else if (title.includes(query)) score += 90;

    if (keywords.some((kw) => kw === query)) score += 70;
    else if (keywords.some((kw) => kw.startsWith(query))) score += 60;
    else if (keywords.some((kw) => kw.includes(query))) score += 45;

    if (synonyms.some((syn) => syn === query)) score += 55;
    else if (synonyms.some((syn) => syn.startsWith(query))) score += 45;
    else if (synonyms.some((syn) => syn.includes(query))) score += 30;

    if (category.includes(query)) score += category.startsWith(query) ? 18 : 10;
    if (description.includes(query)) score += description.startsWith(query) ? 15 : 8;

    return score;
  };

  const closePanel = () => {
    panel.hidden = true;
    resultsList.innerHTML = '';
    emptyMessage.hidden = true;
    currentResults = [];
    activeIndex = -1;
  };

  const openPanel = () => {
    panel.hidden = false;
  };

  const moveTo = (index) => {
    if (!currentResults[index]) return;
    window.location.href = currentResults[index].url;
  };

  const updateActiveItem = () => {
    const items = resultsList.querySelectorAll('.search-result-item');
    items.forEach((item, idx) => {
      const isActive = idx === activeIndex;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-selected', String(isActive));
    });
  };

  const renderResults = (results) => {
    resultsList.innerHTML = '';

    if (!results.length) {
      openPanel();
      emptyMessage.hidden = false;
      return;
    }

    emptyMessage.hidden = true;
    openPanel();

    results.forEach((entry, index) => {
      const li = document.createElement('li');
      li.className = 'search-result-item';
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', 'false');

      const link = document.createElement('a');
      link.href = entry.url;
      link.dataset.index = String(index);

      const title = document.createElement('p');
      title.className = 'search-result-title';
      title.textContent = entry.title;

      const meta = document.createElement('p');
      meta.className = 'search-result-meta';

      const category = document.createElement('span');
      category.className = 'search-result-category';
      category.textContent = entry.category;

      const description = document.createElement('p');
      description.className = 'search-result-description';
      description.textContent = entry.description;

      meta.appendChild(category);
      link.appendChild(title);
      link.appendChild(meta);
      link.appendChild(description);
      li.appendChild(link);
      resultsList.appendChild(li);
    });

    activeIndex = -1;
    updateActiveItem();
  };

  const search = (query) => {
    const normalizedQuery = normalize(query);

    if (normalizedQuery.length < MIN_QUERY_LENGTH) {
      closePanel();
      return;
    }

    currentResults = indexEntries
      .map((entry) => ({ entry, score: scoreEntry(entry, normalizedQuery) }))
      .filter((result) => result.score >= 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_RESULTS)
      .map((result) => result.entry);

    renderResults(currentResults);
  };

  root.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!panel.hidden && currentResults.length > 0) {
      moveTo(activeIndex >= 0 ? activeIndex : 0);
    }
  });

  input.addEventListener('input', () => {
    search(input.value);
  });

  input.addEventListener('focus', () => {
    if (normalize(input.value).length >= MIN_QUERY_LENGTH) {
      search(input.value);
    }
  });

  input.addEventListener('keydown', (event) => {
    if (panel.hidden || !currentResults.length) {
      if (event.key === 'Escape') closePanel();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      activeIndex = (activeIndex + 1) % currentResults.length;
      updateActiveItem();
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      activeIndex = (activeIndex - 1 + currentResults.length) % currentResults.length;
      updateActiveItem();
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      moveTo(activeIndex >= 0 ? activeIndex : 0);
      return;
    }

    if (event.key === 'Escape') {
      closePanel();
    }
  });

  document.addEventListener('click', (event) => {
    if (!root.contains(event.target)) {
      closePanel();
    }
  });

  input.addEventListener('blur', () => {
    requestAnimationFrame(() => {
      if (!root.contains(document.activeElement)) {
        closePanel();
      }
    });
  });

  fetch('/assets/data/search-index.json')
    .then((response) => {
      if (!response.ok) throw new Error('Search index fetch failed');
      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data)) return;
      indexEntries = data
        .filter((entry) => entry && entry.title && entry.url)
        .map((entry) => ({ ...entry, _searchText: toSearchText(entry) }));
    })
    .catch(() => {
      indexEntries = [];
      closePanel();
    });
})();
