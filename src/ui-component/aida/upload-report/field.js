import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Pagination } from 'ui-component/aida/pagination';

function CustomTooltip(props) {
  const { active, payload } = props;
  if (active && payload[0]?.value) {
    return (
      <Box sx={{ background: 'white', p: 1, border: '1px solid #111' }}>
        {payload && payload.map(item => (
          <Box key={item.payload.name} sx={{ color: '#282828', whiteSpace: 'nowrap' }}>
            <span>{item.payload.caption}:</span>
            <span style={{ marginLeft: 8 }}>
              {`${item.payload.count}(${(item.value * 100).toFixed(2)}%)`}
            </span>
          </Box>
        ))}
      </Box>
    );
  }
  return null;
}

export const FieldChart = ({ data, unit = null, sx = {} }) => {
  const [page, setPage] = useState(0);
  
  const chartData = data?.buckets ?? [];
  const offset = page * 5;
  const dataToShow = chartData.slice(offset, offset + 5);
  while (dataToShow.length < 5) {
    dataToShow.push({ caption: '', total: 0 });
  }

  return (
    <Box sx={{
      borderColor: theme => theme.palette.grey['100'],
      borderRadius: 2,
      borderWidth: 1,
      borderStyle: 'solid',
      mx: 'auto', my: 2,
      textDecoration: 'none',
      ...sx
    }}>
      <Typography
        variant='h5'
        sx={{
          mt: 1, p: 2,
          borderBottom: '1px solid #eee',
          borderColor: theme => theme.palette.grey['100']
        }}
      >
        {data.caption}
      </Typography>

      <Box sx={{ height: 272, maxWidth: '100%', display: 'flex', px: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', width: '50%' }}>
          {dataToShow.map((data, idx) => (
            <Typography key={idx + offset + 1} sx={{ height: 20 }}>
              {data.caption ? `${idx + offset + 1}. ${data.caption}` : ''}
            </Typography>
          ))}
        </Box>
        <ResponsiveContainer height='100%' width='50%'>
          <BarChart data={dataToShow} layout='vertical' barCategoryGap='20%'>
            <XAxis hide type='number' domain={[0, 1]} />
            <YAxis hide type='category' />
            <Tooltip content={CustomTooltip} />
            <Bar dataKey='percentage' fill='#608BFF' />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={{
        px: 2,
        borderTop: '1px solid #eee',
        borderColor: theme => theme.palette.grey['100'],
      }}>
        <Pagination
          count={chartData.length}
          page={page}
          onPageChange={setPage}
          pageSize={5}
          name={unit ?? data.caption}
        />
      </Box>
    </Box>
  )
}