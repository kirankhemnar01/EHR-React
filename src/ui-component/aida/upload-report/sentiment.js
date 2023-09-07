import { Card, Typography, CardContent } from '@mui/material';
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

export const SentimentChart = ({ data }) => {
  const buckets = data?.buckets ?? [];

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h5" sx={{ my: 2 }}>
          {data.caption}
        </Typography>
        <ResponsiveContainer width='100%' height={320}>
          <LineChart data={buckets}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="caption" />
            <YAxis axisLine={false} domain={[-2,2]} />
            <Tooltip content={CustomTooltip} />
            <Line type="monotone" dataKey="value" stroke="#608BFF" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
