import { addDays, makeLocalAppearUTC } from 'helpers/utils';

import { format as dateFormat } from 'date-fns';

export const updateFacetData = (originalFacetData, dateFacetSourceData, { eventType, eventData }) => {
  const newFacetData = JSON.parse(JSON.stringify(originalFacetData));
  const updateField = {};
  if (eventType === 'facets') {
    const { facetType, caption, bucketName, bucketCaption, value } = eventData;
    if (facetType === 'bucket' && newFacetData.fieldFacetDataArray) {
      const facet = newFacetData.fieldFacetDataArray.find((f) => f.caption === caption);
      if (facet && bucketName) {
        const bucket = facet.buckets.find((b) => b.name === bucketName);
        if (bucket) {
          bucket.selected = !bucket.selected;
        } else {
          // append a new bucket for the tag
          facet.buckets = facet.buckets.concat({ caption: bucketCaption, count: 0, name: bucketName, selected: true });
        }
      }
      updateField[facet.caption] = 0;
    } else if (facetType === 'date' && newFacetData.dateFacetData) {
      newFacetData.dateFacetData.buckets = newFacetData.dateFacetData.buckets.map((bucket) => {
        if (bucket.max_value < value.value[0] || value.value[1] < bucket.min_value)
          return { ...bucket, selected: false };
        return { ...bucket, selected: true };
      });
      newFacetData.dateFacetData.value = value.value;
      newFacetData.dateFacetData.min_value = value.value[0];
      newFacetData.dateFacetData.max_value = value.value[1];
      newFacetData.dateFacetData.start_date = `${value.minDate}${newFacetData.dateFacetData.start_date.substring(10)}`;
      newFacetData.dateFacetData.end_date = `${value.maxDate}${newFacetData.dateFacetData.end_date.substring(10)}`;
      updateField[newFacetData.dateFacetData.field] = 0;
    }
  } else if (eventType === 'clearBucketFieldFacet') {
    const { facetType, caption } = eventData;
    if (facetType === 'bucket' && newFacetData.fieldFacetDataArray) {
      const facet = newFacetData.fieldFacetDataArray.find((f) => f.caption === caption);
      if (facet) {
        facet.buckets.forEach((bucket) => {
          if (bucket.selected) {
            bucket.selected = false;
          }
        });
      }
      updateField[facet.caption] = 0;
    }
  } else if (eventType === 'clearAllFacets') {
    // clear date range selections
    if (newFacetData && newFacetData.dateFacetData) {
      newFacetData.dateFacetData = { ...dateFacetSourceData };
    }

    // clear tags facets selections
    if (newFacetData && newFacetData.fieldFacetDataArray && newFacetData.fieldFacetDataArray.length) {
      newFacetData.fieldFacetDataArray.forEach((fieldFacet) => {
        fieldFacet.buckets.forEach((bucket) => {
          if (bucket.selected) {
            bucket.selected = false;
          }
        });
      });
    }
    updateField.all = 0;
  }
  newFacetData.updateField = Object.keys(updateField).join(',');
  return newFacetData;
};

export const facetFieldsChanged = (facetData, dateFacetSourceData) => {
  if (
    dateFacetSourceData &&
    facetData &&
    facetData.dateFacetData &&
    dateFacetSourceData.min_value !== facetData.dateFacetData.min_value
  )
    return true;
  if (
    dateFacetSourceData &&
    facetData &&
    facetData.dateFacetData &&
    dateFacetSourceData.max_value !== facetData.dateFacetData.max_value
  )
    return true;
  if (facetData && facetData.fieldFacetDataArray && facetData.fieldFacetDataArray.length) {
    for (let i = 0; i < facetData.fieldFacetDataArray.length; i += 1) {
      const fieldFacet = facetData.fieldFacetDataArray[i];
      for (let j = 0; j < fieldFacet.buckets.length; j += 1) {
        const bucket = fieldFacet.buckets[j];
        if (bucket.selected) return true;

        if (bucket.sub_buckets) {
          for (let k = 0; k < bucket.sub_buckets.length; k += 1) {
            if (bucket.sub_buckets[k].selected) return true;
          }
        }
      }
    }
  }
  return false;
};

export const generateDateFacetChartData = (dateFacetData, dateFacetSelectedBarColor, dateFacetNonselectedBarColor) => {
  const series = dateFacetData.buckets.map(({ count, selected }, index) => ({
    x: index,
    y: count,
    fillColor: selected ? dateFacetSelectedBarColor : dateFacetNonselectedBarColor
  }));

  const chartData = {
    type: 'bar',
    height: 100,
    options: {
      chart: {
        id: 'date-facet-bar-chart',
        sparkline: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        bar: {
          columnWidth: '60%',
          distributed: true
        }
      },
      xaxis: {
        crosshairs: {
          width: 1
        }
      },
      tooltip: {
        fixed: {
          enabled: false
        },
        x: {
          show: false
        },
        y: {
          title: {
            formatter: () => 'Count :'
          }
        },
        marker: {
          show: false
        }
      }
    },
    series: [
      {
        data: series
      }
    ]
  };

  return chartData;
};

export const getDateFacetValue = (dateFacetData) => {
  let [start, end] = [0, 0];
  if (dateFacetData) {
    [start, end] = [dateFacetData.min_value, dateFacetData.max_value];
    //          (dateFacetData.buckets || []).forEach((b) => {
    //              if (b.selected) {
    //                  if (b.min_value < start) start = b.min_value;
    //                  if (b.max_value > end) end = b.max_value;
    //              }
    //          });
  }
  if (start <= end) return [start, end];
  return [end, start];
};

export const int2DateString = (value, startDate) => {
  const newDate = addDays(makeLocalAppearUTC(startDate), value);
  return dateFormat(newDate, 'yyyy-MM-dd');
};

export const clearBucketFieldFacet = (facetData, fieldFacetData, dateFacetSourceData, setFacetData, onFacetChanged) => {
  const fd = updateFacetData(facetData, dateFacetSourceData, {
    eventType: 'clearBucketFieldFacet',
    eventData: {
      facetType: 'bucket',
      caption: fieldFacetData.caption
    }
  });

  setFacetData(fd);
  onFacetChanged({ facetData: fd });
};
