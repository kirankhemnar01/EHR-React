import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Button, TextField, Box, Slider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Chart from 'react-apexcharts';
import differenceInDays from 'date-fns/differenceInDays';
import { format as dateFormat } from 'date-fns';

import { makeLocalAppearUTC, localToUTC } from 'helpers/utils';
import {
  facetFieldsChanged,
  updateFacetData,
  generateDateFacetChartData,
  int2DateString,
  clearBucketFieldFacet
} from './utils';
import { FacetTag, FacetGenericBucket, FacetTagsPanel, FacetCard, FacetGenericBucketsPanel } from './components';
import { sentryException } from 'helpers';
import useAuth from 'hooks/useAuth';
import { sentryEvents } from 'aida-constants';
import { useNotification } from 'hooks/use-notification';
import { useSearchFacetsContext } from './context';

const GenericFieldFacetCardTitle = ({ title, hasSelectedBuckets, fieldFacetData, captureMessage }) => {
  const { dateFacetSourceData, facetData, setFacetData, onFacetChanged } = useSearchFacetsContext();
  const onClickClearAll = () => {
    clearBucketFieldFacet(facetData, fieldFacetData, dateFacetSourceData, setFacetData, onFacetChanged, captureMessage);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Typography variant="h4" component="span" sx={{ color: '#616161' }}>
        {title}
      </Typography>
      {hasSelectedBuckets ? (
        <Typography
          sx={{ ml: 2, color: '#9e9e9e', textDecoration: 'underline', cursor: 'pointer' }}
          variant="body2"
          onClick={onClickClearAll}
        >
          Clear All
        </Typography>
      ) : null}
    </Box>
  );
};

const TagsFieldFacetCardContent = ({ onClickMoreTags, fieldFacetData }) => {
  const { dateFacetSourceData, facetData, setFacetData, onFacetChanged } = useSearchFacetsContext();
  // if there are more than 10 buckets returned, display 10 buckets and +x more by default
  const buckets = fieldFacetData.buckets.slice(0, 10);

  let moreCount = 0;
  if (fieldFacetData.number_of_buckets && fieldFacetData.number_of_buckets > buckets.length)
    moreCount = fieldFacetData.number_of_buckets - buckets.length;

  let groupHasSelectedBuckets = false;
  if (buckets.find((b) => b.selected)) groupHasSelectedBuckets = true;

  return (
    <>
      {buckets.map((facet) => (
        <FacetTag
          groupHasSelectedBuckets={groupHasSelectedBuckets}
          selected={facet.selected}
          key={facet.name}
          bucket={facet}
          tagId={facet.name}
          onClick={() => {
            const fd = updateFacetData(facetData, dateFacetSourceData, {
              eventType: 'facets',
              eventData: {
                facetType: 'bucket', // for tags, source_id, file_type
                caption: fieldFacetData.caption,
                bucketName: facet.name
              }
            });

            setFacetData(fd);
            onFacetChanged({ facetData: fd });
          }}
        />
      ))}
      {moreCount > 0 ? (
        <Button
          variant="text"
          size="small"
          sx={{ fontSize: '0.7rem', alignSelf: 'flex-start', color: '#9e9e9e', textTransform: 'none' }}
          onClick={onClickMoreTags}
        >
          +{moreCount} more
        </Button>
      ) : null}
    </>
  );
};

// Data Sources and File Types Facets
const GenericFieldFacetCardContent = ({ onClickMoreTags, fieldFacetData }) => {
  const { dateFacetSourceData, facetData, setFacetData, onFacetChanged } = useSearchFacetsContext();
  // if there are more than 10 buckets returned, display 10 buckets and +x more by default
  const buckets = fieldFacetData.buckets.slice(0, 10);

  let moreCount = 0;
  if (fieldFacetData.number_of_buckets && fieldFacetData.number_of_buckets > buckets.length)
    moreCount = fieldFacetData.number_of_buckets - buckets.length;

  let groupHasSelectedBuckets = false;
  if (buckets.find((b) => b.selected)) groupHasSelectedBuckets = true;

  return (
    <>
      {buckets.map((facet) => (
        <FacetGenericBucket
          groupHasSelectedBuckets={groupHasSelectedBuckets}
          selected={facet.selected}
          key={facet.name}
          bucket={facet}
          onClick={() => {
            const fd = updateFacetData(facetData, dateFacetSourceData, {
              eventType: 'facets',
              eventData: {
                facetType: 'bucket', // for tags, source_id, file_type
                caption: fieldFacetData.caption,
                bucketName: facet.name
              }
            });

            setFacetData(fd);
            onFacetChanged({ facetData: fd });
          }}
        />
      ))}
      {moreCount > 0 ? (
        <Button
          variant="text"
          size="small"
          sx={{ fontSize: '0.7rem', alignSelf: 'flex-start', color: '#9e9e9e', textTransform: 'none' }}
          onClick={onClickMoreTags}
        >
          +{moreCount} more
        </Button>
      ) : null}
    </>
  );
};

export const SearchFacets = () => {
  const { user } = useAuth();
  const { projectId } = useParams();
  const theme = useTheme();
  const { notifyError } = useNotification();
  const dateFacetSelectedBarColor = theme.palette.primary.main;
  const dateFacetNonselectedBarColor = theme.palette.text.secondary;

  const captureException = sentryException(user, projectId);

  const { dateFacetSourceData, title, searchResults, facetData, setFacetData, onFacetChanged } =
    useSearchFacetsContext();
  const dateFacetData = searchResults?.date_facet;

  const [sliderValue, setSliderValue] = useState(
    dateFacetData ? [dateFacetData.min_value, dateFacetData.max_value] : [0, 0]
  );

  const [minDateInputValue, setMinDateInputValue] = useState(
    dateFacetData ? dateFacetData.start_date.substring(0, 10) : dateFormat(new Date(), 'yyyy-MM-dd')
  );

  const [maxDateInputValue, setMaxDateInputValue] = useState(
    dateFacetData ? dateFacetData.end_date.substring(0, 10) : dateFormat(new Date(), 'yyyy-MM-dd')
  );

  useEffect(() => {
    if (dateFacetSourceData) {
      const min = dateFacetSourceData.start_date.substring(0, 10);
      if (min !== minDateInputValue) setMinDateInputValue(min);
      const max = dateFacetSourceData.end_date.substring(0, 10);
      if (max !== maxDateInputValue) setMaxDateInputValue(max);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFacetSourceData]);

  const updateDateValue = (value, facetType) => {
    const fd = updateFacetData(facetData, dateFacetSourceData, {
      eventType: 'facets',
      eventData: {
        facetType,
        field: facetData.dateFacetData.field,
        bucketName: null,
        subBucketName: null,
        value
      }
    });
    setFacetData(fd);

    onFacetChanged({ facetData: fd });
    // setSliderChanging({ changing: false, value: [0, 0] });
  };

  const onSliderValueChange = (val, commit = false) => {
    if (!dateFacetSourceData) return;

    const value = val;
    if (val[0] > val[1]) {
      value[0] = val[1];
      value[1] = val[0];
    }

    if (sliderValue[0] !== value[0] || sliderValue[1] !== value[1]) {
      setSliderValue(value);
      const minDate = int2DateString(value[0] - dateFacetSourceData.min_value, dateFacetSourceData.start_date);
      const maxDate = int2DateString(value[1] - dateFacetSourceData.min_value, dateFacetSourceData.start_date);
      setMinDateInputValue(minDate);
      setMaxDateInputValue(maxDate);

      if (commit) updateDateValue({ value, minDate, maxDate }, 'date');
    }
  };

  useEffect(() => {
    if (dateFacetSourceData) onSliderValueChange([dateFacetSourceData.min_value, dateFacetSourceData.max_value]);
    // eslint-disable-next-line
  }, [dateFacetSourceData]);

  useEffect(() => {
    if (facetData && facetData.dateFacetData)
      onSliderValueChange([facetData.dateFacetData.min_value, facetData.dateFacetData.max_value]);
    // eslint-disable-next-line
  }, [facetData]);

  const FACETS_PANEL = 'facetsPanel';
  const FACET_TAGS_PANEL = 'facetTagsPanel';
  const FACET_GENERIC_BUCKETS_PANEL = 'facetGenericBucketsPanel';
  const [selectedFacetPanel, setSelectedFacetPanel] = useState(FACETS_PANEL);
  const [selectedFieldFacetDataIndex, setSelectedFieldFacetDataIndex] = useState(-1);

  const onClickBackToFacets = () => {
    setSelectedFacetPanel(FACETS_PANEL);
    setSelectedFieldFacetDataIndex(-1);
  };

  if (selectedFacetPanel === FACET_TAGS_PANEL && selectedFieldFacetDataIndex !== -1)
    return (
      <FacetTagsPanel
        fieldFacetData={facetData.fieldFacetDataArray[selectedFieldFacetDataIndex]}
        onClickBackToFacets={onClickBackToFacets}
      />
    );
  if (selectedFacetPanel === FACET_GENERIC_BUCKETS_PANEL && selectedFieldFacetDataIndex !== -1)
    return (
      <FacetGenericBucketsPanel
        fieldFacetData={facetData.fieldFacetDataArray[selectedFieldFacetDataIndex]}
        onClickBackToFacets={onClickBackToFacets}
      />
    );

  return (
    <Stack direction="column" spacing={1}>
      <Typography variant="h3" sx={{ mt: 5, pl: 1 }}>
        {title}
      </Typography>
      {facetFieldsChanged(facetData, dateFacetSourceData) && (
        <Button
          variant="contained"
          endIcon={<CloseIcon />}
          sx={{ mb: 1 }}
          fullWidth
          onClick={() => {
            const fd = updateFacetData(facetData, dateFacetSourceData, {
              eventType: 'clearAllFacets',
              eventData: null
            });

            setFacetData(fd);
            onFacetChanged({ facetData: fd });
          }}
        >
          Clear filters
        </Button>
      )}
      {dateFacetSourceData && facetData.dateFacetData && (
        <FacetCard
          title={
            <Box sx={{ display: 'flex' }}>
              <Typography variant="h4" component="span" sx={{ color: '#616161' }}>
                {facetData.dateFacetData.caption}
              </Typography>
            </Box>
          }
        >
          <Chart
            width="100%"
            {...generateDateFacetChartData(
              facetData.dateFacetData,
              dateFacetSelectedBarColor,
              dateFacetNonselectedBarColor
            )}
          />
          <Box sx={{ display: 'flex' }}>
            <Slider
              sx={{
                mx: 1,
                '& .MuiSlider-valueLabel': {
                  p: '0.25rem',
                  fontSize: '0.5rem'
                }
              }}
              size="small"
              min={dateFacetSourceData.min_value}
              max={dateFacetSourceData.max_value}
              step={1}
              getAriaLabel={() => 'Date range'}
              value={sliderValue}
              valueLabelFormat={(val) =>
                int2DateString(val - dateFacetSourceData.min_value, dateFacetSourceData.start_date)
              }
              onChange={(event, value) => onSliderValueChange(value)}
              onChangeCommitted={(event, value) => {
                const minDate = int2DateString(
                  value[0] - dateFacetSourceData.min_value,
                  dateFacetSourceData.start_date
                );
                const maxDate = int2DateString(
                  value[1] - dateFacetSourceData.min_value,
                  dateFacetSourceData.start_date
                );
                updateDateValue({ value, minDate, maxDate }, 'date');
              }}
              valueLabelDisplay="auto"
              getAriaValueText={(value) => `${value} to date`}
            />
          </Box>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex' }}>
              <MobileDatePicker
                label="Min"
                inputFormat="yyyy-MM-dd"
                toolbarFormat="yyyy-MM-dd"
                mask="____-__-__"
                minDate={makeLocalAppearUTC(dateFacetSourceData.start_date.substring(0, 10))}
                maxDate={makeLocalAppearUTC(dateFacetSourceData.end_date.substring(0, 10))}
                value={makeLocalAppearUTC(minDateInputValue)}
                onChange={(v) => {
                  const newValue = localToUTC(v);
                  const start = new Date(dateFacetSourceData.start_date.substring(0, 10));
                  const days = differenceInDays(newValue, start);
                  const minDateInput = int2DateString(
                    days - dateFacetSourceData.min_value,
                    dateFacetSourceData.start_date
                  );
                  setMinDateInputValue(minDateInput);
                }}
                onAccept={(v) => {
                  const newValue = localToUTC(v);
                  const start = new Date(dateFacetSourceData.start_date.substring(0, 10));
                  const days = differenceInDays(newValue, start);
                  if (days < 0) {
                    captureException(`Min date must >= ${dateFacetSourceData.start_date}`, {
                      userEvent: sentryEvents.documents.dateRangeChange
                    });

                    notifyError(`Min date must >= ${dateFacetSourceData.start_date}`);
                  } else {
                    onSliderValueChange([days, sliderValue[1]], true);
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} sx={{ minWidth: '100px' }} size="small" variant="outlined" />
                )}
              />
              <Box sx={{ flexGrow: 1, width: '100%' }} />
              <MobileDatePicker
                label="Max"
                inputFormat="yyyy-MM-dd"
                toolbarFormat="yyyy-MM-dd"
                mask="____-__-__"
                minDate={makeLocalAppearUTC(dateFacetSourceData.start_date.substring(0, 10))}
                maxDate={makeLocalAppearUTC(dateFacetSourceData.end_date.substring(0, 10))}
                value={makeLocalAppearUTC(maxDateInputValue)}
                onChange={(v) => {
                  const newValue = localToUTC(v);
                  const start = new Date(dateFacetSourceData.start_date.substring(0, 10));
                  const days = differenceInDays(newValue, start);
                  const maxDate = int2DateString(days - dateFacetSourceData.min_value, dateFacetSourceData.start_date);
                  setMaxDateInputValue(maxDate);
                }}
                onAccept={(v) => {
                  const newValue = localToUTC(v);
                  const start = new Date(dateFacetSourceData.start_date.substring(0, 10));
                  const days = differenceInDays(newValue, start);

                  if (dateFacetSourceData.min_value + days > dateFacetSourceData.max_value) {
                    captureException(`Max date must <= ${dateFacetSourceData.end_date}`, {
                      userEvent: sentryEvents.documents.dateRangeChange
                    });
                    notifyError(`Max date must <= ${dateFacetSourceData.end_date}`);
                  } else {
                    onSliderValueChange([sliderValue[0], days], true);
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} sx={{ minWidth: '100px' }} size="small" variant="outlined" />
                )}
              />
            </Box>
          </LocalizationProvider>
        </FacetCard>
      )}
      {facetData &&
        facetData.fieldFacetDataArray.map((fieldFacetData, index) => {
          let hasSelectedBuckets = false;
          if (fieldFacetData.buckets.find((b) => b.selected)) hasSelectedBuckets = true;
          if (fieldFacetData.field === 'tags')
            return (
              <FacetCard
                title={
                  <GenericFieldFacetCardTitle
                    title={fieldFacetData.caption}
                    hasSelectedBuckets={hasSelectedBuckets}
                    fieldFacetData={fieldFacetData}
                  />
                }
                key={fieldFacetData.caption}
              >
                <TagsFieldFacetCardContent
                  fieldFacetData={fieldFacetData}
                  onClickMoreTags={() => {
                    setSelectedFieldFacetDataIndex(index);
                    setSelectedFacetPanel(FACET_TAGS_PANEL);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </FacetCard>
            );
          return (
            <FacetCard
              title={
                <GenericFieldFacetCardTitle
                  title={fieldFacetData.caption}
                  hasSelectedBuckets={hasSelectedBuckets}
                  fieldFacetData={fieldFacetData}
                />
              }
              key={fieldFacetData.caption}
            >
              <GenericFieldFacetCardContent
                fieldFacetData={fieldFacetData}
                onClickMoreTags={() => {
                  setSelectedFieldFacetDataIndex(index);
                  setSelectedFacetPanel(FACET_GENERIC_BUCKETS_PANEL);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </FacetCard>
          );
        })}
    </Stack>
  );
};
