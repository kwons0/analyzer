function toAbsoluteUrl(src) {
  if (!src) return '';

  try {
    return new URL(src, window.location.href).href;
  } catch {
    return src;
  }
}

function getResolvedImageUrl(img) {
  const src = img.currentSrc || img.src || img.getAttribute('src') || '';

  return toAbsoluteUrl(src);
}

function getOriginalImageUrl(src) {
  if (!src) return '';

  try {
    const url = new URL(src, window.location.href);

    // Next.js Image 최적화 URL 처리
    const isNextImageUrl = url.pathname === '/_next/image' || url.pathname.endsWith('/_next/image');
    const nextImageUrl = url.searchParams.get('url');

    if (isNextImageUrl && nextImageUrl) {
      return new URL(nextImageUrl, window.location.origin).href;
    }

    return url.href;
  } catch {
    return src;
  }
}

function getImageFileName(url) {
  if (!url) return '';

  try {
    const parsedUrl = new URL(url, window.location.href);
    const fileName = parsedUrl.pathname.split('/').pop();

    return decodeURIComponent(fileName || '');
  } catch {
    const pureUrl = url.split('?')[0];
    return decodeURIComponent(pureUrl.split('/').pop() || '');
  }
}

function getAltText(img) {
  const alt = img.getAttribute('alt');

  if (alt === null) return '';

  return alt.trim();
}

function getTitleText(img) {
  const title = img.getAttribute('title');

  if (title === null || title.trim() === '') {
    return '/';
  }

  return title.trim();
}

function createAltIssueMap(imageItems) {
  const groupMap = new Map();

  imageItems.forEach((item) => {
    if (!groupMap.has(item.fileName)) {
      groupMap.set(item.fileName, []);
    }

    groupMap.get(item.fileName).push(item);
  });

  const issueMap = new Map();

  Array.from(groupMap.entries()).forEach(([fileName, items]) => {
    if (items.length < 2) return;

    const emptyAltCount = items.filter((item) => !item.hasAlt).length;
    const filledAltCount = items.filter((item) => item.hasAlt).length;

    // 같은 이미지명 안에서 alt 있음/없음이 섞인 경우만 이슈로 판단
    if (emptyAltCount > 0 && filledAltCount > 0) {
      issueMap.set(fileName, {
        isIssue: true,
        totalCount: items.length,
        emptyAltCount,
        filledAltCount,
      });
    }
  });

  return issueMap;
}

export function checkImageAlt() {
  const images = Array.from(document.querySelectorAll('img'));

  const imageItems = images
    .map((img, index) => {
      const previewUrl = getResolvedImageUrl(img);
      const imageUrl = getOriginalImageUrl(previewUrl);
      const fileName = getImageFileName(imageUrl);
      const alt = getAltText(img);
      const title = getTitleText(img);

      return {
        type: 'info',
        variant: 'image-alt',
        index: index + 1,
        fileName,
        previewUrl,
        imageUrl,
        alt,
        title,
        hasAlt: alt.length > 0,
        element: img,
      };
    })
    .filter((item) => item.fileName);

  const issueMap = createAltIssueMap(imageItems);

  const results = imageItems.map((item) => {
    const issue = issueMap.get(item.fileName);

    return {
      ...item,
      isAltIssue: Boolean(issue),
      issue,
    };
  });

  const issueCount = issueMap.size;
  const totalImageCount = results.length;

  return {
    issueCount,
    totalImageCount,
    notice:
      issueCount > 0
        ? `동일 이미지명 내 alt 누락 이미지 ${issueCount}건이 발견되었습니다.`
        : '',
    results,
  };
}