function getResolvedImageUrl(img) {
  return img.currentSrc || img.src || img.getAttribute('src') || '';
}

function getOriginalImageUrl(src) {
  try {
    const url = new URL(src, window.location.href);

    // Next.js Image 컴포넌트처럼 /_next/image?url=... 형태인 경우 원본 경로 추출
    const originalUrl = url.searchParams.get('url');

    if (originalUrl) {
      return new URL(originalUrl, window.location.origin).href;
    }

    return url.href;
  } catch {
    return src;
  }
}

function getImageFileName(url) {
  try {
    const parsedUrl = new URL(url, window.location.href);
    const fileName = parsedUrl.pathname.split('/').pop();

    return decodeURIComponent(fileName || '');
  } catch {
    return decodeURIComponent(url.split('/').pop() || '');
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
        fileName, // 확장자 포함 파일명
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
        ? `alt 텍스트가 다른 이미지 파일명 ${issueCount}건이 발견되었습니다.`
        : 'alt 텍스트가 다른 이미지가 발견되지 않았습니다.',
  results,
};
}