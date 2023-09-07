import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Grid } from '@mui/material';
import Loader from 'ui-component/Loader';
import { useCaseAnalytics } from 'service/analytics';
import { sentryException } from 'helpers';
import { sentryEvents } from 'aida-constants';
import useAuth from 'hooks/useAuth';
import { DateChart } from './date';
import { FieldChart } from './field';
import { SentimentChart } from './sentiment';

export const UploadReport = () => {
  const { user } = useAuth();
  const { projectId, sourceId } = useParams();
  const { data, loading, error } = useCaseAnalytics(projectId, sourceId);

  useEffect(() => {
    if (error) {
      sentryException(user, projectId, { uploadId: sourceId })(error, {
        userEvent: sentryEvents.uploads.getUploadReport
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  if (loading) {
    return <Loader />;
  }

  if (error || !data) {
    return <div>{error}</div>;
  }

  return (
    <Container maxWidth="md" className="upload-report">
      <Grid container spacing={4}>
        {!!data.date_facet && (
          <Grid item xs={12}>
            <DateChart data={data.date_facet} total={data.number_of_docs} />
          </Grid>
        )}
        {!!data.field_facets &&
          data.field_facets.map((item) => (
            <Grid item xs={12} sm={6} key={item.field}>
              <FieldChart data={item} />
            </Grid>
          ))}
        {!!data.sentiment_date_facet && (
          <Grid item xs={12}>
            <SentimentChart data={data.sentiment_date_facet} />
          </Grid>
        )}
      </Grid>
    </Container>
  );
};
