import { useState, useRef, useEffect } from 'react';
import { Box, Tooltip, Typography, Popover, OutlinedInput } from '@mui/material';

import { IconX } from '@tabler/icons';

import { convertTagValue } from 'helpers/utils';
import { TAG_MAX_VALUE } from 'aida-constants';

const SliderArea = ({
  sliderValue,
  bgcolor,
  tagValue,
  tagPreviewValue = null,
  mutuallyExclusivePreviewing = false
}) => {
  let active = false;
  if (!mutuallyExclusivePreviewing) {
    if (tagPreviewValue !== null && sliderValue === tagPreviewValue) active = true;
    if (tagPreviewValue === null && sliderValue === tagValue) active = true;
  }

  return (
    <>
      <Box
        component="span"
        aria-haspopup="true"
        sx={{
          position: 'absolute',
          left: 0,
          height: '100%',
          borderBottomRightRadius: '3px',
          borderTopRightRadius: '3px',
          width: `${sliderValue * 10}0%`,
          bgcolor: active ? `${bgcolor}80` : null
        }}
      />
    </>
  );
};

export const DocTaggingButton = ({
  groupId,
  tagId,
  caption,
  tagValueType,
  value,
  text,
  bgcolor = '#008800',
  color = '#333333',
  mutuallyExclusive,
  previewingGroupId,
  previewingTagId,
  setPreviewingGroupAndTag,
  changeTagAnnotation
}) => {
  const ref = useRef(null);

  function getTaggingBtnSliderBarValue(offsetX) {
    if (offsetX < 0) offsetX = 0;

    const unit = ref.current ? ref.current.offsetWidth / 11.0 : 0;
    // |--0--1--2--3--4--5--6--7--8--9--10
    for (let i = 0; i <= 10; i += 1) {
      if (Math.round(offsetX) < Math.round((i + 1) * unit)) {
        return i / 10.0;
      }
    }
    return 1;
  }

  const [tagPreviewValue, setPreviewValue] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const popoverOpen = Boolean(anchorEl);

  let mutuallyExclusivePreviewing = false;
  if (mutuallyExclusive && previewingGroupId === groupId && previewingTagId !== tagId)
    mutuallyExclusivePreviewing = true;

  const initTagTextValue = text || '';
  const [tagTextValue, setTagTextValue] = useState(initTagTextValue);
  useEffect(() => {
    if (initTagTextValue !== tagTextValue) setTagTextValue(initTagTextValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initTagTextValue]);

  // make the x outsize of the tag button
  // only show the cross line when user explicitly click the x button.
  // if user is just clicking the binary tag, it switches between filled and unfilled.

  const confirmTagTextChange = () => {
    if (tagTextValue === initTagTextValue) return;

    // when the button is unfilled(value=0), we can just remove the tag from annotation(set value=-1)
    changeTagAnnotation({
      groupId,
      tagId,
      mutuallyExclusive,
      tagValue: value === 0 ? -1 : value,
      tagTextValue,
      tagValueType
    });
  };

  useEffect(() => {
    let delayDebounceFn = null;
    delayDebounceFn = setTimeout(() => {
      confirmTagTextChange();
    }, 500);
    return () => (delayDebounceFn ? clearTimeout(delayDebounceFn) : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagTextValue]);

  const onClick = (event) => {
    let tagValue;
    if (tagValueType === 'confidence') {
      const { offsetX } = event.nativeEvent;
      tagValue = getTaggingBtnSliderBarValue(offsetX);
    } else if (value > 0) tagValue = 0;
    else tagValue = TAG_MAX_VALUE;

    // when the button is unfilled(value=0), we can just remove the tag from annotation(set value=-1)
    changeTagAnnotation({
      groupId,
      tagId,
      mutuallyExclusive,
      tagValue: tagValue === 0 ? -1 : tagValue,
      tagTextValue,
      tagValueType
    });
  };

  // only when user clicks the x next to the tag button, we set value=0
  const onDelete = (event) => {
    event.stopPropagation();
    changeTagAnnotation({ groupId, tagId, mutuallyExclusive, tagValue: 0, tagTextValue, tagValueType });
  };

  const onMouseEnterOrMove = (event) => {
    if (tagValueType === 'confidence') {
      const { offsetX } = event.nativeEvent;
      const value = getTaggingBtnSliderBarValue(offsetX);

      // do not show Confidence 0
      if (value > 0) {
        setPreviewValue(value);
        setAnchorEl(event.currentTarget);

        if (mutuallyExclusive) setPreviewingGroupAndTag(groupId, tagId);
      }
    }
  };

  const onMouseLeave = () => {
    if (tagValueType === 'confidence') {
      setPreviewValue(null);
      setAnchorEl(null);

      if (mutuallyExclusive) setPreviewingGroupAndTag(null, null);
    }
  };

  const taggingButton = (
    <Box
      className={`DocTaggingButton DocTaggingButton-${tagId} DocTaggingButton-${tagValueType}`}
      ref={ref}
      sx={{
        alignItems: 'center',
        borderLeft: `4px solid ${bgcolor}`,
        borderBottomRightRadius: '3px',
        borderTopRightRadius: '3px',
        color: `${color}`,
        display: 'flex',
        fontSize: '14px',
        fontWeight: 400,
        height: '26px',
        lineHeight: '26px',
        padding: '0 8px',
        position: 'relative',
        margin: '0 4px 8px 0',
        cursor: 'pointer',
        bgcolor: '#fafafa'
      }}
    >
      {(tagValueType === 'confidence' ? [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1] : [TAG_MAX_VALUE]).map(
        (sliderValue) => (
          <SliderArea
            key={sliderValue}
            sliderValue={sliderValue}
            tagValue={convertTagValue(value, tagValueType)}
            tagPreviewValue={convertTagValue(tagPreviewValue, tagValueType)}
            bgcolor={bgcolor}
            mutuallyExclusivePreviewing={mutuallyExclusivePreviewing}
          />
        )
      )}
      <Typography
        component="span"
        onClick={onClick}
        onMouseEnter={onMouseEnterOrMove}
        onMouseMove={onMouseEnterOrMove}
        onMouseLeave={onMouseLeave}
        sx={{
          position: 'absolute',
          left: 0,
          padding: '0 3px',
          width: 'calc(100% - 4px)',
          textAlign: 'center',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textDecoration: value === 0 ? 'line-through' : 'inherit'
        }}
      >
        {caption}
      </Typography>

      {tagValueType === 'confidence' && (
        <Popover
          sx={{
            pointerEvents: 'none'
          }}
          open={popoverOpen}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          disableRestoreFocus
        >
          <Typography sx={{ p: 1 }}>{`Confidence ${
            tagPreviewValue !== null ? convertTagValue(tagPreviewValue, tagValueType) : ''
          }`}</Typography>
        </Popover>
      )}
    </Box>
  );

  const activeCssClass = value > 0 ? 'active' : '';
  return (
    <Box
      className={`DocTaggingButtonContainer ${activeCssClass}`}
      sx={{
        maxWidth: '24em',
        float: 'left',
        mb: 1.5,
        mr: 1,
        userSelect: 'none',
        position: 'relative',
        pr: 2,
        '& .btn': {
          visibility: 'hidden',
          cursor: 'pointer',
          position: 'absolute',
          top: '4px',
          right: 0
        },
        '&:hover .btn': {
          visibility: 'visible'
        }
      }}
    >
      <Box sx={{ visibility: 'hidden', height: 0, borderLeft: '4px', paddingLeft: '8px', paddingRight: '8px' }}>
        {`${caption.substr(0, 24)}___`}
      </Box>
      {caption.length <= 24 ? taggingButton : <Tooltip title={caption}>{taggingButton}</Tooltip>}
      {!mutuallyExclusive && <IconX className="btn" stroke={1.5} size="1rem" onClick={onDelete} />}
      {tagValueType === 'text' && value === TAG_MAX_VALUE && (
        <OutlinedInput
          fullWidth
          multiline
          rows={5}
          placeholder="Enter a description..."
          value={tagTextValue}
          onChange={(event) => setTagTextValue(event.target.value)}
        />
      )}
    </Box>
  );
};
