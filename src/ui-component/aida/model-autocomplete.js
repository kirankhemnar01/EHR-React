import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// project imports
import { captureException } from '@sentry/react';
import { sentryEvents } from 'aida-constants';
import { SingleOptionAutocomplete } from 'ui-component/aida/base';
import { getAllModels } from 'service/models/apis';
import { useNotification } from 'hooks/use-notification';

export const ModelAutocomplete = ({ name, value, onChange, label = 'Model', width = '100%' }) => {
  const { projectId } = useParams();
  const { notifyError } = useNotification();
  const [modelOptions, setModelOptions] = useState([]);
  const optionValue = modelOptions.find((m) => m.value === value) || null;
  useEffect(() => {
    const loadModels = async () => {
      try {
        const { results: models } = await getAllModels(projectId);
        setModelOptions(
          models.map((model) => ({
            name: model.name,
            value: model.model_id
          }))
        );
      } catch (e) {
        notifyError(e.message || JSON.stringify(e));
        captureException(e, {
          userEvent: sentryEvents.models.getModels,
          projectId
        });
      }
    };

    loadModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <SingleOptionAutocomplete
      {...{ name, label, width }}
      options={modelOptions}
      value={optionValue}
      onChange={(v) => onChange(v.value)}
    />
  );
};
