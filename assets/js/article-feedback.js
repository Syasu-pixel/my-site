(() => {
  const articleSlug = 'plc-drilling-line-design-project-01';
  const mainColumn = document.querySelector('.main-column');
  if (!mainColumn) return;

  let section = document.getElementById('articleFeedbackCard');

  if (!section) {
    const style = document.createElement('style');
    style.id = 'article-feedback-style';
    style.textContent = `
      .article-feedback-card{text-align:center;background:linear-gradient(180deg,#f8fbff,#fff);border-color:#cfe0f4}
      .article-feedback-card h2{margin-bottom:8px}
      .article-feedback-lead{margin:0 auto 18px!important;max-width:46rem;color:#64748b}
      .article-feedback-actions{display:flex;justify-content:center;gap:12px;flex-wrap:wrap}
      .article-feedback-button{min-width:190px;min-height:48px;padding:10px 18px;border:1px solid #cbd5e1;border-radius:16px;background:#fff;color:#334155;font-weight:900;cursor:pointer;box-shadow:0 6px 16px rgba(15,23,42,.04);transition:.15s ease}
      .article-feedback-button:hover,.article-feedback-button:focus-visible{transform:translateY(-1px);border-color:#93c5fd;box-shadow:0 10px 20px rgba(15,23,42,.08)}
      .article-feedback-button.is-selected{border-color:#60a5fa;background:#eff6ff;color:#1d4ed8}
      .article-feedback-button:disabled{cursor:wait;opacity:.65;transform:none}
      .article-feedback-status{min-height:26px;margin:14px 0 0!important;color:#475569;font-size:13px!important;font-weight:800}
      .article-feedback-note{margin:4px 0 0!important;color:#94a3b8;font-size:11px!important}
      @media(max-width:640px){.article-feedback-actions{display:grid;grid-template-columns:1fr}.article-feedback-button{width:100%;min-width:0}}
    `;
    document.head.appendChild(style);

    section = document.createElement('section');
    section.id = 'articleFeedbackCard';
    section.className = 'section-card article-feedback-card';
    section.setAttribute('aria-labelledby', 'articleFeedbackTitle');
    section.innerHTML = `
      <h2 id="articleFeedbackTitle">この記事は役に立ちましたか？</h2>
      <p class="article-feedback-lead">今後の記事づくりの参考にします。どちらかを選ぶだけで回答できます。</p>
      <div class="article-feedback-actions" role="group" aria-label="記事の評価">
        <button class="article-feedback-button" type="button" data-feedback-vote="helpful">👍 役に立った</button>
        <button class="article-feedback-button" type="button" data-feedback-vote="not_helpful">👎 役に立たなかった</button>
      </div>
      <p class="article-feedback-status" id="articleFeedbackStatus" aria-live="polite"></p>
      <p class="article-feedback-note">回答は匿名で集計し、個人情報の入力はありません。</p>`;

    const related = document.getElementById('related');
    if (related && related.parentElement === mainColumn) mainColumn.insertBefore(section, related);
    else mainColumn.appendChild(section);
  }

  const endpoint = 'https://pavitnsnmoaiospswiys.supabase.co/functions/v1/article-feedback';
  const publishableKey = 'sb_publishable_J3Muz4RVr7sqDsSTen1LNA_y_mgKAyG';
  const voterKeyStorage = 'denkicontrol-feedback-voter-key';
  const voteStorage = `denkicontrol-feedback:${articleSlug}`;
  const status = section.querySelector('#articleFeedbackStatus');
  const buttons = [...section.querySelectorAll('[data-feedback-vote]')];
  if (!status || buttons.length === 0) return;

  const memoryStore = new Map();
  const storage = {
    get(key) {
      try { return localStorage.getItem(key); }
      catch { return memoryStore.get(key) || null; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); }
      catch { memoryStore.set(key, value); }
    }
  };

  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  const makeVoterKey = () => {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
      const random = Math.random() * 16 | 0;
      const value = char === 'x' ? random : (random & 0x3 | 0x8);
      return value.toString(16);
    });
  };

  const getVoterKey = () => {
    let key = storage.get(voterKeyStorage);
    if (!key || !uuidRe.test(key)) {
      key = makeVoterKey();
      storage.set(voterKeyStorage, key);
    }
    return key;
  };

  const renderSelection = (vote) => {
    buttons.forEach((button) => {
      const selected = button.dataset.feedbackVote === vote;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  };

  buttons.forEach((button) => button.setAttribute('aria-pressed', 'false'));

  const previousVote = storage.get(voteStorage);
  if (previousVote === 'helpful' || previousVote === 'not_helpful') {
    renderSelection(previousVote);
    status.textContent = previousVote === 'helpful' ? '前回の回答：役に立った' : '前回の回答：役に立たなかった';
  }

  const submitVote = async (vote) => {
    buttons.forEach((button) => { button.disabled = true; });
    status.textContent = '送信しています…';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': publishableKey
        },
        body: JSON.stringify({ article_slug: articleSlug, vote, voter_key: getVoterKey() })
      });
      if (!response.ok) {
        let detail = '';
        try { detail = await response.text(); } catch {}
        throw new Error(`feedback request failed: ${response.status}${detail ? ` ${detail}` : ''}`);
      }

      storage.set(voteStorage, vote);
      renderSelection(vote);
      status.textContent = '回答ありがとうございます。記事改善に活用します。';
    } catch (error) {
      console.error('[article feedback]', error);
      status.textContent = '送信できませんでした。もう一度お試しください。';
    } finally {
      buttons.forEach((button) => { button.disabled = false; });
    }
  };

  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopImmediatePropagation();
      submitVote(button.dataset.feedbackVote);
    });
  });
})();
