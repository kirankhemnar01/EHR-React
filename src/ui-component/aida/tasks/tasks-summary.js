import { Box, Typography } from '@mui/material';

const InfoCard = ({ name, value }) => {
  return (
    <Box component="article">
      <Typography variant="body1" sx={{ mb: 1 }}>
        {name}
      </Typography>
      <Typography variant="h4" sx={{ fontSize: '1.25rem' }}>
        {value}
      </Typography>
    </Box>
  );
};

export const TasksSummary = ({ summary }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 4 }}>
      <InfoCard name="Total tasks" value={summary ? Number(summary.number_of_tasks).toLocaleString() : 0} />
      <InfoCard name="Total coded" value={summary ? Number(summary.number_of_annotated_docs).toLocaleString() : 0} />
      <InfoCard
        name="Coded today"
        value={summary ? Number(summary.number_of_annotated_docs_today).toLocaleString() : 0}
      />
      <Box sx={{ flexGrow: 1 }} />
    </Box>
  );
};
