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

(() => {
  const path = location.pathname.replace(/\/+$/, '') || '/';
  if (path !== '/' && path !== '/index.html') return;
  if (location.pathname.startsWith('/en/')) return;
  if (document.querySelector('[data-category-shelf="career"]')) return;

  const compareCard = document.querySelector('[data-category-shelf="compare"]');
  const grid = compareCard && compareCard.closest('.support-category-grid');
  const pills = document.querySelector('.finder-pills');
  if (!compareCard || !grid || !pills) return;

  const style = document.createElement('style');
  style.id = 'career-preview-home-style';
  style.textContent = `
    .support-category-card--career{border-color:#c4b5fd;background:linear-gradient(135deg,#faf7ff 0%,#fff 100%)}
    .support-category-card--career .support-category-card__image{display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#ede9fe,#f8f7ff);font-size:48px}
    .support-category-card--career .support-category-card__title{color:#5b21b6}
    .support-category-card--career .support-category-card__description{color:#64748b}
  `;
  document.head.appendChild(style);

  const card = document.createElement('a');
  card.className = 'support-category-card support-category-card--career';
  card.id = 'shelf-career';
  card.href = 'categories/career.html';
  card.dataset.categoryShelf = 'career';
  card.setAttribute('aria-label', 'キャリア・転職の記事一覧へ');
  card.innerHTML = `
    <span class="support-category-card__image" aria-hidden="true">🧭</span>
    <span class="support-category-card__body">
      <span class="support-category-card__title">キャリア・転職</span>
      <span class="support-category-card__description">電気・FAの仕事、必要なスキル、キャリア、転職先の考え方を技術者目線で整理します。</span>
    </span>`;
  grid.appendChild(card);

  const careerButton = document.createElement('button');
  careerButton.className = 'finder-pill category-filter';
  careerButton.type = 'button';
  careerButton.dataset.categoryFilter = 'career';
  careerButton.dataset.filter = 'career';
  careerButton.setAttribute('aria-pressed', 'false');
  careerButton.textContent = 'キャリア・転職';
  pills.appendChild(careerButton);

  pills.querySelectorAll('.category-filter[data-category-filter]').forEach((button) => {
    if (button === careerButton) return;
    button.addEventListener('click', () => {
      careerButton.classList.remove('active');
      careerButton.setAttribute('aria-pressed', 'false');
      card.hidden = true;
    });
  });

  careerButton.addEventListener('click', () => {
    document.querySelectorAll('.finder-pills .category-filter[data-category-filter]').forEach((button) => {
      const active = button === careerButton;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-category-shelf]').forEach((shelf) => {
      shelf.hidden = shelf !== card;
    });
  });
})();

(() => {
  const path = location.pathname.replace(/\/+$/, '') || '/';
  if (path !== '/' && path !== '/index.html') return;
  if (location.pathname.startsWith('/en/')) return;
  if (document.querySelector('.project-series-entry')) return;

  const featured = document.getElementById('featured');
  if (!featured) return;

  const style = document.createElement('style');
  style.id = 'project-series-entry-style';
  style.textContent = `
    .project-series-entry{margin:2px 0 12px;padding:0 20px;border-top:none!important}
    .project-series-entry__link{display:grid;grid-template-columns:180px minmax(0,1fr);gap:18px;align-items:center;padding:14px 16px;border:1px solid #bfdbfe;border-radius:18px;background:linear-gradient(135deg,#eff6ff 0%,#fff 62%);box-shadow:0 6px 16px rgba(15,23,42,.05);color:#0f172a;text-decoration:none}
    .project-series-entry__link:hover,.project-series-entry__link:focus-visible{border-color:#60a5fa;background:#f8fbff;box-shadow:0 12px 24px rgba(15,23,42,.09);transform:translateY(-1px);text-decoration:none}
    .project-series-entry__media{width:180px;height:112px;overflow:hidden;border-radius:14px;border:1px solid #dbeafe;background:#fff}
    .project-series-entry__media img{width:100%;height:100%;object-fit:cover;object-position:center;display:block}
    .project-series-entry__body{min-width:0}
    .project-series-entry__kicker{display:inline-flex;align-items:center;min-height:24px;padding:0 9px;margin-bottom:6px;border-radius:999px;background:#dbeafe;color:#1d4ed8;font-size:11px;font-weight:900}
    .project-series-entry__title{display:block;margin:0;color:#0f172a;font-size:19px;line-height:1.4;font-weight:900}
    .project-series-entry__sub{display:block;margin-top:4px;color:#475569;font-size:13.5px;line-height:1.55;font-weight:700}
    .project-series-entry__cta{display:inline-flex;margin-top:8px;color:#1d4ed8;font-size:13px;line-height:1.4;font-weight:900}
    @media(min-width:1101px){.project-series-entry__link{width:824px;max-width:824px}}
    @media(max-width:768px){.project-series-entry{padding:0 13px;margin:4px 0 10px}.project-series-entry__link{grid-template-columns:104px minmax(0,1fr);gap:11px;padding:11px;border-radius:16px}.project-series-entry__media{width:104px;height:78px;border-radius:12px}.project-series-entry__title{font-size:15px}.project-series-entry__sub{font-size:12px;line-height:1.45}.project-series-entry__cta{margin-top:5px;font-size:12px}}
    @media(max-width:430px){.project-series-entry__link{grid-template-columns:1fr}.project-series-entry__media{width:100%;height:132px}.project-series-entry__title{font-size:16px}}
  `;
  document.head.appendChild(style);

  const section = document.createElement('section');
  section.className = 'panel-block section project-series-entry';
  section.setAttribute('aria-label', '実践・設備設計シリーズ');
  section.innerHTML = `
    <a class="project-series-entry__link" href="articles/plc-drilling-line-design-project-01.html">
      <span class="project-series-entry__media">
        <img src="assets/images/articles/plc-drilling-line-design-project-01-hero.webp" alt="穴あけ加工ライン設計プロジェクト" loading="lazy" decoding="async">
      </span>
      <span class="project-series-entry__body">
        <span class="project-series-entry__kicker">実践・設備設計</span>
        <strong class="project-series-entry__title">PLCで設備を1から設計する</strong>
        <span class="project-series-entry__sub">穴あけ加工ライン設計プロジェクト</span>
        <span class="project-series-entry__cta">第1回：設備全体の構想から始めよう →</span>
      </span>
    </a>`;
  featured.insertAdjacentElement('afterend', section);
})();

(() => {
  const path = location.pathname.replace(/\/+$/, '') || '/';
  if (path !== '/' && path !== '/index.html') return;
  if (location.pathname.startsWith('/en/')) return;

  const mainCard = document.querySelector('#featured .feature-main');
  const miniCards = document.querySelectorAll('#featured .feature-side-stack .featured-mini-card');
  if (!mainCard || miniCards.length < 2) return;

  const mainMedia = mainCard.querySelector('.feature-main-media');
  const mainImage = mainCard.querySelector('.feature-main-media img');
  const mainTitle = mainCard.querySelector('.feature-main-body h3');
  const mainDesc = mainCard.querySelector('.feature-main-body p');
  const mainCta = mainCard.querySelector('.feature-main-body .btn');

  if (mainMedia) {
    mainMedia.href = 'articles/star-delta-start-basic.html';
    mainMedia.setAttribute('aria-label', 'スターデルタ始動の記事へ');
  }
  if (mainImage) {
    mainImage.src = 'assets/images/star-delta-start-basic/star-delta-start-overview.webp';
    mainImage.alt = 'スターデルタ始動の結線と切替を示す記事イメージ';
  }
  if (mainTitle) mainTitle.innerHTML = 'スターデルタ始動とは？<br>結線・回路図・始動電流を整理';
  if (mainDesc) mainDesc.textContent = 'スター結線からデルタ結線へ切り替える流れ、始動電流を抑える理由、接触器とタイマの役割まで図で追いやすく整理します。';
  if (mainCta) {
    mainCta.href = 'articles/star-delta-start-basic.html';
    mainCta.textContent = 'スターデルタ始動の記事を読む';
  }

  const shield = miniCards[0];
  shield.href = 'articles/shielded-cable-basic.html';
  const shieldImage = shield.querySelector('img');
  const shieldTag = shield.querySelector('.mini-card-tag');
  const shieldTitle = shield.querySelector('h3');
  const shieldDesc = shield.querySelector('p');
  if (shieldImage) {
    shieldImage.src = 'assets/images/shielded-cable-basic/shielded-cable-basic-ogp.png';
    shieldImage.alt = 'シールドケーブルの基本';
  }
  if (shieldTag) {
    shieldTag.className = 'mini-card-tag orange';
    shieldTag.textContent = 'ノイズ対策';
  }
  if (shieldTitle) shieldTitle.textContent = 'シールドケーブルの基本';
  if (shieldDesc) shieldDesc.textContent = 'ノイズ対策、接地、配線ルートの考え方を現場目線で整理。';

  const air = miniCards[1];
  air.href = 'articles/air-cylinder-basic.html';
  const airImage = air.querySelector('img');
  const airTag = air.querySelector('.mini-card-tag');
  const airTitle = air.querySelector('h3');
  const airDesc = air.querySelector('p');
  if (airImage) {
    airImage.src = 'assets/images/air-cylinder-basic/air-cylinder-basic-ogp.webp';
    airImage.alt = 'エアシリンダの基本';
  }
  if (airTag) {
    airTag.className = 'mini-card-tag green';
    airTag.textContent = 'FA機器';
  }
  if (airTitle) airTitle.textContent = 'エアシリンダの基本';
  if (airDesc) airDesc.textContent = '圧縮空気で動く仕組みと、バルブ・リードスイッチとの関係を整理。';
})();

(() => {
  const path = location.pathname.replace(/\/+$/, '');
  if (!/^\/articles\/[a-z0-9][a-z0-9-]*(?:\.html)?$/i.test(path)) return;
  if (document.querySelector('script[src*="/assets/js/article-feedback.js"]')) return;

  const script = document.createElement('script');
  script.src = '/assets/js/article-feedback.js?v=20260916-8';
  script.async = false;
  script.dataset.articleFeedbackLoader = 'true';
  document.head.appendChild(script);
})();
