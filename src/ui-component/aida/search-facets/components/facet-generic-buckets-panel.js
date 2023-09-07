import { useState } from 'react';
import { Box, Stack, Button, Typography } from '@mui/material';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';

import { SearchBar } from 'ui-component/aida/base/search-bar';
import { FacetGenericBucket } from './facet-generic-bucket';
import { updateFacetData, clearBucketFieldFacet } from '../utils';
import { useSearchFacetsContext } from '../context';

export const FacetGenericBucketsPanel = ({ fieldFacetData, onClickBackToFacets }) => {
  const { dateFacetSourceData, facetData, setFacetData, onFacetChanged } = useSearchFacetsContext();
  const buckets = fieldFacetData.buckets;
  const selectedBucketNameDict = {};
  buckets.forEach((b) => {
    if (b.selected) selectedBucketNameDict[b.name] = true;
  });
  const groupHasSelectedBuckets = Object.keys(selectedBucketNameDict).length > 0;

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
    <Stack className="FacetGenericBucketsPanel" direction="column" spacing={2}>
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
          {fieldFacetData.caption}
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

      {buckets && (
        <Box>
          {buckets
            .filter(
              (bucket) =>
                !query || bucket.name.toLowerCase().includes(query) || bucket.caption.toLowerCase().includes(query)
            )
            .map((bucket) => (
              <FacetGenericBucket
                groupHasSelectedBuckets={groupHasSelectedBuckets}
                selected={Boolean(selectedBucketNameDict[bucket.name])}
                key={bucket.name}
                bucket={bucket}
                onClick={() => {
                  const fd = updateFacetData(facetData, dateFacetSourceData, {
                    eventType: 'facets',
                    eventData: {
                      facetType: 'bucket', // for tags, source_id, file_type
                      caption: fieldFacetData.caption,
                      bucketName: bucket.name,
                      bucketCaption: bucket.name
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
