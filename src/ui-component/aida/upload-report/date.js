import { Card, Typography, CardContent } from '@mui/material';
import { useMemo } from 'react';
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ResponsiveContainer
} from 'recharts';
import { CustomTooltip } from 'ui-component/aida/charts';

export const DateChart = ({ data, total }) => {
  const { buckets, domain } = useMemo(() => {
    const buckets = data?.buckets ?? [];
    let min = Infinity;
    let max = 0;
    for (const buck of buckets) {
      if (min > buck.count) min = buck.count;
      if (max < buck.count) max = buck.count;
    }

    return { buckets, domain: [min, max] };
  }, [data])

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h5" sx={{ my: 2 }}>
          {`${total} Documents`}
        </Typography>
        <ResponsiveContainer width='100%' height={320}>
          <LineChart data={buckets}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="caption" />
            <YAxis axisLine={false} allowDecimals={false} domain={domain} />
            <Tooltip content={CustomTooltip} />
            <Line type="monotone" dataKey="count" stroke="#608BFF" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
