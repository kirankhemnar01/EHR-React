import { useMemo } from 'react';
import { Card, Typography, CardContent } from '@mui/material';
import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { normalizeFacetFile } from 'helpers/analytics';
import { FILE_COLORS } from 'helpers/colors';

export const FileReport = (props) => {
  const { data } = props;

  const chartData = useMemo(() => normalizeFacetFile(data), [data])
  const normalized = []
  const other = { name: 'other', count: 0 }
  // eslint-disable-next-line no-restricted-syntax
  for (const item of chartData) {
    if (item.name in FILE_COLORS && item.name !== 'other') {
      normalized.push(item)
    } else {
      other.count += item.count
    }
  }
  if (other.count > 0) {
    normalized.push(other)
  }

  return (
    <Card className='general-chart'>
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          Document types
        </Typography>
        <ResponsiveContainer width='100%' height={320}>
          <PieChart>
            <Legend
              align="right"
              wrapperStyle={{ paddingLeft: 16, paddingBottom: 16 }}
              iconType='circle'
              layout='vertical'
              verticalAlign='middle'
              iconSize={8}
            />
            <Pie
              data={normalized}
              dataKey="count"
              cx="50%"
              cy="50%"
              innerRadius={120}
              outerRadius={140}
              startAngle={90}
              endAngle={-270}
            >
              {
                normalized.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={FILE_COLORS[entry.name] ?? FILE_COLORS.other} />
                ))
              }
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
