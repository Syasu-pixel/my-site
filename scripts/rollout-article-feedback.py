from pathlib import Path

SITE_SEARCH = Path('assets/js/site-search.js')
ARTICLE_01 = Path('articles/plc-drilling-line-design-project-01.html')
WORKFLOW = Path('.github/workflows/rollout-article-feedback.yml')
SELF = Path('scripts/rollout-article-feedback.py')

text = SITE_SEARCH.read_text(encoding='utf-8')
marker = "\n(() => {\n  const articleSlug = 'plc-drilling-line-design-project-01';"
idx = text.find(marker)
if idx == -1:
    raise SystemExit('legacy article feedback block not found')

loader = r'''

(() => {
  const path = location.pathname.replace(/\/+$/, '');
  if (!/^\/articles\/[a-z0-9][a-z0-9-]*\.html$/i.test(path)) return;
  if (document.querySelector('script[src*="/assets/js/article-feedback.js"]')) return;

  const script = document.createElement('script');
  script.src = '/assets/js/article-feedback.js?v=20260916-5';
  script.async = false;
  script.dataset.articleFeedbackLoader = 'true';
  document.head.appendChild(script);
})();
'''
SITE_SEARCH.write_text(text[:idx].rstrip() + loader, encoding='utf-8')

article = ARTICLE_01.read_text(encoding='utf-8')
article = article.replace(
    '../assets/js/article-feedback.js?v=20260916-2',
    '../assets/js/article-feedback.js?v=20260916-5'
)
ARTICLE_01.write_text(article, encoding='utf-8')

# one-shot files are removed after applying the rollout to the preview branch
if WORKFLOW.exists():
    WORKFLOW.unlink()
if SELF.exists():
    SELF.unlink()
