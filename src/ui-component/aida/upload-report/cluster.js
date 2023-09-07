import { useMemo } from 'react';
import { Card, Typography, CardContent } from '@mui/material';
import {
  CartesianGrid,
  XAxis,
  YAxis,
  ComposedChart,
  Tooltip,
  Bar,
  ResponsiveContainer,
  Legend,
  LabelList
} from 'recharts';
import { CustomTooltip } from 'ui-component/aida/charts';
import { normalizeFacetCluster } from 'helpers/analytics';

const renderCustomizedLabel = (props) => {
  const { x, y, width, height, value, offset } = props;

  return (
    <g>
      <text x={x + width + offset} y={y + height / 2} fill="#666" textAnchor="start" dominantBaseline="middle">
        {value}
      </text>
    </g>
  );
};

export const ClusterReport = (props) => {
  const { data } = props;

  const normalized = useMemo(() => normalizeFacetCluster(data), [data])

  return (
    <Card className='general-chart'>
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          Document grouping
        </Typography>
        <ResponsiveContainer width='100%' height={320}>
          <ComposedChart data={normalized} layout='vertical' barGap={0}>
            <CartesianGrid horizontal={false} />
            <XAxis type='number' axisLine={false} />
            <YAxis dataKey="name" type="category" width={120} />
            <Tooltip content={CustomTooltip} />
            <Legend
              align="right"
              wrapperStyle={{ paddingLeft: 16 }}
              iconType='square'
              layout='vertical'
              verticalAlign='top'
              iconSize={8}
            />
            <Bar dataKey="groups" barSize={20} fill="#608BFF">
              <LabelList dataKey='groups' position='right' content={renderCustomizedLabel} />
            </Bar>
            <Bar dataKey="Unique docs" barSize={20} fill="#00E1A9">
              <LabelList dataKey='Unique docs' position='right' content={renderCustomizedLabel} />
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
