import { useMemo } from 'react';
import { Card, Typography, CardContent } from '@mui/material';
import {
  CartesianGrid,
  XAxis,
  YAxis,
  ComposedChart,
  Tooltip,
  Bar,
  ResponsiveContainer
} from 'recharts';
import { normalizeFacetCustodian } from 'helpers/analytics';

export const CustodianReport = (props) => {
  const { data } = props;

  const chartData = useMemo(() => normalizeFacetCustodian(data), [data])

  return (
    <Card className='custodian-chart'>
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {`${chartData?.length ?? 0} Custodians`}
        </Typography>
        <section className='auto-scroll-y h-320'>
          <ResponsiveContainer width='100%' height={Math.max(312, 25 * chartData.length)}>
            <ComposedChart data={chartData} layout='vertical'>
              <CartesianGrid horizontal={false} />
              <XAxis type='number' axisLine={false} />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="count" barSize={15} fill="#608BFF" />
            </ComposedChart>
          </ResponsiveContainer>
        </section>
      </CardContent>
    </Card>
  )
}
