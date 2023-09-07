import { Card, CardHeader, CardContent } from '@mui/material';

export function FacetCard({ title, children }) {
  return (
    <Card>
      <CardHeader sx={{ p: 2, py: 1 }} title={title} />
      <CardContent sx={{ py: 0, px: 2 }}>{children}</CardContent>
    </Card>
  );
}
