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
  const isEnglishPage = location.pathname.startsWith('/en/');

  const ensureHiddenStyle = () => {
    if (document.getElementById('site-search-hidden-style')) return;
    const style = document.createElement('style');
    style.id = 'site-search-hidden-style';
    style.textContent = '[hidden]{display:none!important;}';
    document.head.appendChild(style);
  };

  ensureHiddenStyle();

  panel.hidden = true;
  emptyMessage.hidden = true;
  resultsList.innerHTML = '';

  let indexEntries = [];
  let currentResults = [];
  let activeIndex = -1;
  let hasSearched = false;
  let isIndexLoaded = false;
  let tokenDocumentFrequency = new Map();

  currentResults = [];
  activeIndex = -1;
  hasSearched = false;

  const normalizeText = (value) =>
    (value || '')
      .toString()
      .normalize('NFKC')
      .toLowerCase()
      .replace(/[‐‑‒–—―ｰ]/g, '-')
      .replace(/[／⁄]/g, '/')
      .replace(/[＿]/g, '_')
      .replace(/\s+/g, ' ')
      .trim();

  const katakanaToHiragana = (text) =>
    text.replace(/[\u30a1-\u30f6]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60));

  const getSearchVariants = (value) => {
    const base = normalizeText(value);
    if (!base) return [];
    const hira = katakanaToHiragana(base);
    const noLong = hira.replace(/ー+/g, '');
    const compact = noLong.replace(/[-_/\\・･,.:;()[\]{}'"`~!?+*=<>|]/g, '').replace(/\s+/g, '');
    const withSpace = noLong.replace(/[-_/]+/g, ' ');
    const noSep = noLong.replace(/[-_/]+/g, '');
    const collapsedSpace = noLong.replace(/\s+/g, '');
    return [...new Set([base, hira, noLong, compact, withSpace, noSep, collapsedSpace].filter(Boolean))];
  };

  const toSearchText = (entry) => {
    const fields = [
      entry.title,
      entry.category,
      entry.description,
      ...(Array.isArray(entry.keywords) ? entry.keywords : []),
      ...(Array.isArray(entry.synonyms) ? entry.synonyms : [])
    ];

    return fields.flatMap((field) => getSearchVariants(field)).join(' ');
  };

  const tokenizeQuery = (value) => {
    const normalized = normalizeText(value);
    if (!normalized) return [];

    return [...new Set(
      normalized
        .split(/[\s,，、。]+/)
        .flatMap((token) => getSearchVariants(token))
        .filter(Boolean)
    )];
  };

  const includesSearchToken = (value, token) => {
    if (!/^[a-z]{1,3}$/.test(token)) return value.includes(token);

    let position = value.indexOf(token);
    while (position >= 0) {
      const before = value[position - 1] || '';
      const after = value[position + token.length] || '';
      if (!/[a-z0-9]/.test(before) && !/[a-z0-9]/.test(after)) return true;
      position = value.indexOf(token, position + 1);
    }
    return false;
  };

  const getFieldScore = (values, tokenVariants, weights) => {
    let bestScore = 0;

    tokenVariants.forEach((token) => {
      values.forEach((value) => {
        if (value === token) bestScore = Math.max(bestScore, weights.exact);
        else if (value.startsWith(token) && includesSearchToken(value, token)) {
          bestScore = Math.max(bestScore, weights.startsWith);
        } else if (includesSearchToken(value, token)) bestScore = Math.max(bestScore, weights.includes);
      });
    });

    return bestScore;
  };

  const scoreEntry = (entry, query) => {
    const queryVariants = getSearchVariants(query);
    if (!queryVariants.length) return -1;

    const queryTokens = normalizeText(query)
      .split(/[\s,，、。]+/)
      .map((token) => ({ raw: token, variants: getSearchVariants(token) }))
      .filter((token) => token.variants.length > 0);
    if (!queryTokens.length) return -1;

    const title = getSearchVariants(entry.title);
    const category = getSearchVariants(entry.category);
    const description = getSearchVariants(entry.description);
    const keywords = (Array.isArray(entry.keywords) ? entry.keywords : []).flatMap(getSearchVariants);
    const synonyms = (Array.isArray(entry.synonyms) ? entry.synonyms : []).flatMap(getSearchVariants);
    const haystack = entry._searchText;

    const matchedTokens = queryTokens.filter((token) =>
      token.variants.some((variant) => includesSearchToken(haystack, variant))
    );
    if (!matchedTokens.length) return -1;

    const hasMatch = (values, fn) =>
      queryVariants.some((qv) => values.some((value) => fn(value, qv)));

    // Token coverage is deliberately the strongest signal. Field weights then
    // decide the order among entries with the same number of matching words.
    let score = matchedTokens.length * 1200;
    score += Math.round((matchedTokens.length / queryTokens.length) * 500);
    if (matchedTokens.length === queryTokens.length) score += 1000;

    matchedTokens.forEach((token) => {
      const documentFrequency = tokenDocumentFrequency.get(token.raw) || indexEntries.length;
      const rarity = Math.log((indexEntries.length + 1) / (documentFrequency + 1));
      score += Math.round(rarity * 40);

      score += getFieldScore(title, token.variants, { exact: 150, startsWith: 110, includes: 90 });
      score += getFieldScore(keywords, token.variants, { exact: 70, startsWith: 60, includes: 45 });
      score += getFieldScore(synonyms, token.variants, { exact: 55, startsWith: 45, includes: 30 });
      score += getFieldScore(category, token.variants, { exact: 18, startsWith: 18, includes: 10 });
      score += getFieldScore(description, token.variants, { exact: 15, startsWith: 15, includes: 8 });
    });

    // Keep the existing whole-query preference, especially for unspaced terms,
    // without allowing it to outweigh an article matching more query tokens.
    if (queryVariants.some((variant) => title.some((value) => value === variant))) score += 300;
    else if (hasMatch(title, (v, q) => v.startsWith(q))) score += 220;
    else if (hasMatch(title, (v, q) => v.includes(q))) score += 180;

    if (hasMatch(keywords, (v, q) => v === q)) score += 140;
    else if (hasMatch(keywords, (v, q) => v.startsWith(q))) score += 120;
    else if (hasMatch(keywords, (v, q) => v.includes(q))) score += 90;

    if (hasMatch(synonyms, (v, q) => v === q)) score += 110;
    else if (hasMatch(synonyms, (v, q) => v.startsWith(q))) score += 90;
    else if (hasMatch(synonyms, (v, q) => v.includes(q))) score += 60;

    const entryIsEnglish = entry.lang === 'en' || entry.url.startsWith('/en/');
    if (entryIsEnglish === isEnglishPage) score += 25;

    return score;
  };

  const closePanel = () => {
    panel.hidden = true;
    resultsList.innerHTML = '';
    emptyMessage.hidden = true;
    currentResults = [];
    activeIndex = -1;
    hasSearched = false;
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
      if (!hasSearched) {
        closePanel();
        return;
      }
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
    const normalizedQuery = normalizeText(query);

    if (normalizedQuery.length < MIN_QUERY_LENGTH) {
      closePanel();
      return;
    }

    if (!isIndexLoaded) {
      closePanel();
      return;
    }

    hasSearched = true;

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
    if (normalizeText(input.value).length >= MIN_QUERY_LENGTH) {
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
      isIndexLoaded = true;
      if (!Array.isArray(data)) return;
      indexEntries = data
        .filter((entry) => entry && entry.title && entry.url)
        .map((entry) => ({ ...entry, _searchText: toSearchText(entry) }));
      tokenDocumentFrequency = new Map();
      indexEntries.forEach((entry) => {
        const entryTokens = new Set(tokenizeQuery([
          entry.title,
          ...(Array.isArray(entry.keywords) ? entry.keywords : []),
          ...(Array.isArray(entry.synonyms) ? entry.synonyms : [])
        ].join(' ')));
        entryTokens.forEach((token) => {
          tokenDocumentFrequency.set(token, (tokenDocumentFrequency.get(token) || 0) + 1);
        });
      });
    })
    .catch(() => {
      isIndexLoaded = true;
      indexEntries = [];
      closePanel();
    });
})();
