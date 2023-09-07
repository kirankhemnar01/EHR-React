import { useState } from 'react';

import { Box, Stack, Button, Typography } from '@mui/material';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';

import useAida from 'hooks/useAida';
import { SearchBar } from 'ui-component/aida/base/search-bar';
import { FacetTag } from './facet-tag';
import { updateFacetData, clearBucketFieldFacet } from '../utils';
import { useSearchFacetsContext } from '../context';

export const FacetTagsPanel = ({ fieldFacetData, onClickBackToFacets }) => {
  const { tagGroups: tagGroupsData } = useAida();
  const { data: tagGroups } = tagGroupsData;
  const tagGroupCaption = fieldFacetData.caption;
  const group = tagGroups.find((g) => g.name === tagGroupCaption);

  const { dateFacetSourceData, facetData, setFacetData, onFacetChanged } = useSearchFacetsContext();
  const buckets = fieldFacetData.buckets;
  const selectedTagIdDict = {};
  buckets.forEach((b) => {
    if (b.selected) selectedTagIdDict[b.name] = true;
  });
  const groupHasSelectedBuckets = Object.keys(selectedTagIdDict).length > 0;

  const [query, setQuery] = useState('');

  const onSearch = (value) => {
    setQuery(value.trim().toLowerCase());
  };
  const onClear = () => {
    setQuery('');
  };

  const onClickClearAll = () => {
    clearBucketFieldFacet(facetData, fieldFacetData, dateFacetSourceData, setFacetData, onFacetChanged);
  };

  return (
    <Stack className="FacetTagsPanel" direction="column" spacing={2}>
      <Box sx={{ display: 'flex' }}>
        <Button
          variant="outlined"
          sx={{ my: 2 }}
          startIcon={<KeyboardBackspaceOutlinedIcon />}
          onClick={onClickBackToFacets}
        >
          Back to facets
        </Button>
      </Box>

      <Box sx={{ display: 'flex' }}>
        <Typography variant="h4" component="span" sx={{ color: '#616161' }}>
          {tagGroupCaption}
        </Typography>
        {groupHasSelectedBuckets ? (
          <Typography
            sx={{ ml: 2, color: '#9e9e9e', textDecoration: 'underline', cursor: 'pointer' }}
            variant="body2"
            onClick={onClickClearAll}
          >
            Clear All
          </Typography>
        ) : null}
      </Box>

      <SearchBar
        sx={{ width: '100%' }}
        placeholder="Search tags"
        onSearch={onSearch}
        onClear={onClear}
        keyInputTriggerSearch
      />

      {group && group.tags && (
        <Box>
          {group.tags
            .filter(
              (tag) => !query || tag.name.toLowerCase().includes(query) || tag.tag_id.toLowerCase().includes(query)
            )
            .map((tag) => (
              <FacetTag
                groupHasSelectedBuckets={groupHasSelectedBuckets}
                selected={Boolean(selectedTagIdDict[tag.tag_id])}
                key={tag.tag_id}
                bucket={buckets.find((b) => b.name === tag.tag_id)}
                tagId={tag.tag_id}
                onClick={() => {
                  const fd = updateFacetData(facetData, dateFacetSourceData, {
                    eventType: 'facets',
                    eventData: {
                      facetType: 'bucket', // for tags, source_id, file_type
                      caption: fieldFacetData.caption,
                      bucketName: tag.tag_id,
                      bucketCaption: tag.name
                    }
                  });

                  setFacetData(fd);
                  onFacetChanged({ facetData: fd });
                }}
              />
            ))}
        </Box>
      )}
    </Stack>
  );
};
