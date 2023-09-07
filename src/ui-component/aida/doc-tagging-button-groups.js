import { useState } from 'react';

// material-ui
import { Typography, Grid } from '@mui/material';

// project imports
import { SearchBar } from 'ui-component/aida/base/search-bar';
import { gridSpacing, TAG_EMPTY_VALUE } from 'aida-constants';

import { DocTaggingButton } from 'ui-component/aida/doc-tagging-button';

export const DocTaggingButtonGroups = ({
  tagGroups,
  previewingGroupId,
  previewingTagId,
  setPreviewingGroupAndTag,
  changeTagAnnotation,
  annotation
}) => {
  const [query, setQuery] = useState(''); // tag query

  return (
    <>
      <SearchBar
        placeholder="Search tags"
        sx={{ width: '100%', mb: 2, mt: 1 }}
        onSearch={(value) => {
          setQuery(value.trim());
        }}
        onClear={() => {
          setQuery('');
        }}
        keyInputTriggerSearch
      />
      {tagGroups &&
        tagGroups
          .filter((g) => g.visible !== false)
          .map((g) => {
            const filteredTags = g.tags
              .filter((t) => t.visible !== false)
              .filter((t) => !query || t.name.toLowerCase().includes(query.toLowerCase()))
              .map((t) => {
                let value = TAG_EMPTY_VALUE;
                let text = '';
                if (annotation) {
                  const label = (annotation.labels || []).find((label) => label.tag_id === t.tag_id);
                  if (label) {
                    value = label.value || 0;
                    text = label.text || '';
                  }
                }
                return (
                  <DocTaggingButton
                    key={t.tag_id}
                    groupId={g.tag_group_id}
                    tagId={t.tag_id}
                    caption={t.name}
                    bgcolor={t.color}
                    tagValueType={t.value_type}
                    value={value}
                    text={text}
                    mutuallyExclusive={g.mutually_exclusive}
                    previewingGroupId={previewingGroupId}
                    previewingTagId={previewingTagId}
                    setPreviewingGroupAndTag={setPreviewingGroupAndTag}
                    changeTagAnnotation={changeTagAnnotation}
                  />
                );
              });
            return filteredTags && filteredTags.length > 0 ? (
              <Grid container spacing={gridSpacing} key={g.tag_group_id} className="TagGroup">
                <Grid item xs={12}>
                  <Typography align="left" component="h2" sx={{ color: '#616161', mt: 2, fontSize: '1rem' }}>
                    {g.name}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  {filteredTags}
                </Grid>
              </Grid>
            ) : null;
          })}
    </>
  );
};
