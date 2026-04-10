(function () {
  const AMAZON_LINK_SELECTOR = 'a[href*="amzn.to"], a[href*="amazon.co.jp"]';

  function isAmazonCta(link) {
    const className = (link.className || '').toLowerCase();
    const text = (link.textContent || '').toLowerCase();
    return (
      className.includes('btn') ||
      className.includes('amazon-button') ||
      text.includes('amazon')
    );
  }

  function findMatchingAmazonHref(img) {
    let node = img.parentElement;

    while (node && node !== document.body) {
      const links = Array.from(node.querySelectorAll(AMAZON_LINK_SELECTOR)).filter(isAmazonCta);

      if (links.length === 1) {
        return links[0].href;
      }

      if (links.length > 1) {
        const following = links.find((link) => {
          const pos = img.compareDocumentPosition(link);
          return Boolean(pos & Node.DOCUMENT_POSITION_FOLLOWING);
        });

        return (following || links[0]).href;
      }

      node = node.parentElement;
    }

    return null;
  }

  function wrapProductImage(img, href) {
    if (!href || img.closest('a')) return;

    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'amazon-image-link';
    img.parentNode.insertBefore(link, img);
    link.appendChild(img);
  }

  function applyImageLinks() {
    const images = Array.from(document.querySelectorAll('img'));

    images.forEach((img) => {
      const href = findMatchingAmazonHref(img);
      if (href) {
        wrapProductImage(img, href);
      }
    });
  }

  function injectStyles() {
    if (document.getElementById('amazon-image-link-styles')) return;

    const style = document.createElement('style');
    style.id = 'amazon-image-link-styles';
    style.textContent = `
      .amazon-image-link {
        display: inline-block;
        cursor: pointer;
        line-height: 0;
      }
      .amazon-image-link img {
        cursor: pointer;
        transition: opacity .2s ease, transform .2s ease;
      }
      @media (hover: hover) and (pointer: fine) {
        .amazon-image-link:hover img {
          opacity: .92;
          transform: scale(1.02);
        }
      }
      @media (max-width: 768px) {
        .amazon-image-link {
          padding: 4px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      injectStyles();
      applyImageLinks();
    });
  } else {
    injectStyles();
    applyImageLinks();
  }
})();
