import { createContext, useContext, useState, useEffect, useCallback } from 'react';

import { sentryEvents } from 'aida-constants';
import { sentryException } from 'helpers';
import useAuth from 'hooks/useAuth';

import * as SearchApi from 'service/search';

const SorterContext = createContext({});

export const SorterContextProvider = ({ projectId, children, getSorterFields }) => {
  const { user } = useAuth();
  const [sorterTypes, setSorterTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sorters, setSorters] = useState([]);

  const captureException = sentryException(user, projectId);

  const fnGetSorterFields = getSorterFields ?? SearchApi.getSorterFields;

  useEffect(() => {
    const init = async () => {
      setError('');
      setLoading(true);

      try {
        const types = await fnGetSorterFields({ projectId });
        setSorterTypes(types);
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

  const deparseSorters = useCallback((sorters) => {
    const clauses = [];
    for (const sorter of sorters) {
      clauses.push({ field: sorter.key?.field, order: sorter.value });
    }

    return clauses;
  }, []);

  const parseSorters = useCallback(
    async (sorters) => {
      const result = [];
      let types = sorterTypes;
      if (types.length <= 0) {
        try {
          types = await fnGetSorterFields({ projectId });
          setSorterTypes(types);
        } catch (e) {
          console.error(e);
          return result;
        }
      }

      let timestamp = new Date().getTime();
      for (const sorter of sorters) {
        result.push({
          id: timestamp++,
          key: types.find((type) => type.field === sorter.field),
          value: sorter.order,
          checked: true
        });
      }
      return result;
    },
    [fnGetSorterFields, sorterTypes, projectId]
  );

  return (
    <SorterContext.Provider
      value={{
        sorterTypes,
        loading,
        error,
        sorters,
        setSorters,
        deparseSorters,
        parseSorters
      }}
    >
      {children}
    </SorterContext.Provider>
  );
};
export const useSorterContext = () => useContext(SorterContext);
