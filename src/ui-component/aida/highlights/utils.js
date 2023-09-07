import { escapeHtml } from 'helpers/utils';

export const isPreviousElementHasClassName = (curElem, testClassName) => {
  let preElem = curElem.prevousElementSibling;
  while (preElem) {
    if (preElem.classList.contains(testClassName)) return true;
    preElem = preElem.prevousElementSibling;
  }
  return false;
};

export const mergeHighlightSpans = (highlightSpans, hitSpans) => {
  const offsetDict = {};
  highlightSpans.forEach((h) => {
    for (let i = h.start_offset; i < h.end_offset; i++) {
      const hid = h.highlight_id;
      if (i in offsetDict && !offsetDict[i].find((k) => k.hid === hid))
        offsetDict[i].push({ hid, color: h.color, type: 'highlight' });
      else offsetDict[i] = [{ hid, color: h.color, type: 'highlight' }];
    }
  });

  hitSpans.forEach((h) => {
    const [start, end, ht, hitCount] = h;
    for (let i = start; i < end; i++) {
      const hid = `hit_${ht.highlightGroupId}_${ht.highlightTermId}`;
      if (i in offsetDict && !offsetDict[i].find((k) => k.hid === hid))
        offsetDict[i].push({ hid, type: 'hit', hitCount, ...ht });
      else offsetDict[i] = [{ hid, type: 'hit', hitCount, ...ht }];
    }
  });

  const mergedSpans = [];
  const offsets = Object.keys(offsetDict)
    .map((i) => parseInt(i, 10))
    .sort((a, b) => a - b);
  let spanIds;
  let spanIdsStr;
  let spanStart = -1;
  for (let i = 0; i < offsets.length; i++) {
    const offset = offsets[i];
    const idObjs = offsetDict[offset];
    const idsStr = idObjs.map((o) => o.hid).join('_');

    if (i > 0 && offsets[i - 1] + 1 !== offset) {
      // create a new span
      mergedSpans.push([spanStart, offsets[i - 1] + 1, spanIds]);
      spanStart = offset;
      spanIds = idObjs;
      spanIdsStr = idsStr;
    } else if (idsStr !== spanIdsStr) {
      if (spanIds !== undefined) {
        // create a new span
        mergedSpans.push([spanStart, offsets[i - 1] + 1, spanIds]);
      }
      spanStart = offset;
      spanIds = idObjs;
      spanIdsStr = idsStr;
    }
  }
  if (spanIds !== undefined) {
    // last span
    mergedSpans.push([spanStart, offsets.pop() + 1, spanIds]);
  }
  return mergedSpans;
};

export const getHitSpans = (text, highlights) => {
  const hitTermsDict = {};
  (highlights || []).forEach((h) => {
    h.highlight_terms.forEach((ht) => {
      const hitTerms = [];
      ht.hit_terms.forEach((hs) => {
        hitTerms.push({
          text: hs.text,
          color: h.color,
          count: hs.count,
          highlightTermId: ht.id,
          highlightGroupId: h.highlight_group_id,
          visible: ht.visible
        });
      });
      hitTermsDict[ht.id] = hitTerms;
    });
  });

  const hitSpans = [];
  Object.values(hitTermsDict).forEach((hitTerms) => {
    let hitCount = 0;
    hitTerms.forEach((ht) => {
      const w = ht.text;
      const len = w.length;
      for (const match of text.matchAll(new RegExp(`\\b${w}\\b`, 'g'))) {
        hitSpans.push([match.index, match.index + len, ht, hitCount]);
        hitCount += 1;
      }
    });
  });
  hitSpans.sort((a, b) => a[0] - b[0]);
  return hitSpans;
};

export const highlightText = (text, highlightRawSpans, hideAllHighlights, textOffset, searchHighlights) => {
  const hitSpans = getHitSpans(text, searchHighlights);
  const mergedSpans = mergeHighlightSpans(highlightRawSpans, hitSpans);
  const invisible = Boolean(hideAllHighlights);

  const newTextArr = [];
  let prev = 0;
  mergedSpans.forEach((hs) => {
    const [start, end, configs] = hs;
    if (start > prev) newTextArr.push(escapeHtml(text.substring(prev, start)));
    if (end > prev) {
      const genericHighlightConfigs = configs.filter((c) => c.hid !== null);
      let configClasses = genericHighlightConfigs.map((c) => `generic-highlight-id-${c.hid}`).join(' ');
      if (genericHighlightConfigs.length > 1) configClasses += ' generic-highlight-overlapping';

      let hitConfig = configs.find((c) => c.type === 'hit');
      if (hitConfig) {
        configClasses += ` ${hitConfig.visible ? 'hit-visible' : 'hit-invisible'} hit-highlight hit-highlight-group-${
          hitConfig.highlightGroupId
        } hit-highlight-term-${hitConfig.highlightTermId} hit-highlight-hit-${hitConfig.hitCount}`;
      } else {
        hitConfig = configs.find((c) => c.hid === null);
        if (hitConfig) configClasses += ' hit-visible hit-highlight';
      }

      let visibleClasses = '';
      if (genericHighlightConfigs.length > 0)
        visibleClasses = `${invisible ? 'generic-highlight-invisible' : 'generic-highlight-visible'} generic-highlight`;
      else if (hitConfig) visibleClasses = 'hit-highlight';

      newTextArr.push(
        `<em class="${visibleClasses} ${configClasses} generic-highlight-start-${
          start - textOffset
        } generic-highlight-end-${end - textOffset}">${escapeHtml(text.substring(start, end))}</em>`
      );
      prev = end;
    }
  });
  if (prev < text.length) newTextArr.push(escapeHtml(text.substring(prev)));
  return newTextArr.join('');
};

export const getSelection = () => {
  const selection = window.getSelection();
  const text = selection.toString();
  const range = selection.getRangeAt(0);
  let startOffset = range.startOffset;
  const startContainer = range.startContainer;
  if (startContainer.previousSibling) {
    const prevEndOffsetClassName = startContainer.previousSibling.classList.value
      .split(' ')
      .find((c) => c.startsWith('generic-highlight-end-'));
    startOffset += parseInt(prevEndOffsetClassName.substring('generic-highlight-end-'.length), 10);
  } else if (
    startContainer.parentNode &&
    startContainer.parentNode.classList.value.indexOf('generic-highlight') !== -1
  ) {
    const parentStartOffsetClassName = startContainer.parentNode.classList.value
      .split(' ')
      .find((c) => c.startsWith('generic-highlight-start-'));
    startOffset += parseInt(parentStartOffsetClassName.substring('generic-highlight-start-'.length), 10);
  }

  return { text, startOffset };
};
