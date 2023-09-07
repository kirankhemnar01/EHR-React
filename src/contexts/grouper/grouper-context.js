import { createContext, useContext, useState, useEffect } from 'react';

import { sentryEvents } from 'aida-constants';
import { sentryException } from 'helpers';
import useAuth from 'hooks/useAuth';

const GrouperContext = createContext({});

export const noneOption = { name: 'None', value: '' };

export const GrouperContextProvider = ({ projectId, children, getGroupFields }) => {
  const { user } = useAuth();
  const [groupingOptions, setGroupingOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [grouper, setGrouper] = useState(noneOption);

  const captureException = sentryException(user, projectId);

  useEffect(() => {
    const init = async () => {
      setError('');
      setLoading(true);

      try {
        const options = await getGroupFields({ projectId });

        setGroupingOptions([noneOption, ...options.map((opt) => ({ name: opt.caption, value: opt.field }))]);
      } catch (e) {
        captureException(e, {
          userEvent: sentryEvents.filterContext.getFilterFields
        });
        setError(e.message ?? JSON.stringify(e));
      } finally {
        setLoading(false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <GrouperContext.Provider
      value={{
        groupingOptions,
        loading,
        error,
        grouper,
        setGrouper
      }}
    >
      {children}
    </GrouperContext.Provider>
  );
};

export const useGrouperContext = () => useContext(GrouperContext);
