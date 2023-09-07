/* eslint-disable consistent-return */
/* eslint-disable no-await-in-loop */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

import { sentryEvents, defaultQueryType } from 'aida-constants';
import { sentryException } from 'helpers';
import useAuth from 'hooks/useAuth';
import * as SearchApi from 'service/search';

export const operatorsWithArrayValue = ['in', 'not in'];
export const operatorsWithoutValue = ['exists', 'not exists'];
export const connectorOptions = [
  { name: 'AND', value: 'AND' },
  { name: 'OR', value: 'OR' }
];

const FilterContext = createContext({});

export const FilterContextProvider = ({ projectId, children, getFilterFields, getFilterFieldValues }) => {
  const { user } = useAuth();
  const [filterTypes, setFilterTypes] = useState([]);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState([]);
  const checkedFilters = filters.filter(
    (item) => item.checked && (!!item.value || operatorsWithoutValue.includes(item.operator))
  );
  const [query, setQuery] = useState('');
  const [queryType, setQueryType] = useState(defaultQueryType);

  const captureException = sentryException(user, projectId);

  const fnGetFilterFields = getFilterFields ?? SearchApi.getFilterFields;
  const fnGetFilterFieldValues = getFilterFieldValues ?? SearchApi.getFilterFieldValues;

  useEffect(() => {
    const init = async () => {
      setError('');
      setLoading(true);

      try {
        const types = await fnGetFilterFields({ projectId });
        setFilterTypes(types);
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

  const getFieldValues = useCallback(
    async (field, q = '') => {
      setError('');
      setLoading(true);
      try {
        const fieldValues = await fnGetFilterFieldValues({ projectId, field, q });
        setValues((values) => ({ ...values, [field]: fieldValues }));
        return fieldValues;
      } catch (e) {
        captureException(e, {
          userEvent: sentryEvents.filterContext.getFilterFieldValues,
          field
        });
        setError(e.message ?? JSON.stringify(e));
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projectId]
  );

  const parseFilters = useCallback(
    async (filters) => {
      const result = [];
      let types = filterTypes;
      let timestamp = new Date().getTime();
      for (const filter of filters) {
        let value = filter.value;
        let fieldValues = values[filter.field];

        if (filter.op_type === 'term_filter_op') {
          if (!fieldValues) {
            // eslint-disable-next-line no-await-in-loop
            try {
              fieldValues = await fnGetFilterFieldValues({ projectId, field: filter.field });
            } catch (e) {
              console.error(e);
              return result;
            }
            setValues((values) => ({ ...values, [filter.field]: fieldValues }));
          }

          let parsedValue;
          if (Array.isArray(value)) {
            parsedValue = [];
            for (const item of value) {
              let valueObj = fieldValues.find((v) => v.name === item);
              if (!valueObj) {
                try {
                  fieldValues = await fnGetFilterFieldValues({ projectId, field: filter.field, q: item });
                } catch (e) {
                  console.error(e);
                  return result;
                }
                valueObj = fieldValues.find((v) => v.name === item);
              }

              if (valueObj) parsedValue.push(valueObj);
            }
          } else {
            let valueObj = fieldValues.find((v) => v.name === value);
            if (!valueObj) {
              try {
                fieldValues = await fnGetFilterFieldValues({ projectId, field: filter.field, q: value });
              } catch (e) {
                console.error(e);
                return result;
              }
              valueObj = fieldValues.find((v) => v.name === value);
            }

            parsedValue = valueObj ?? null;
          }

          value = parsedValue;
        }

        if (operatorsWithArrayValue.includes(filter.op) && !value) {
          value = [];
        }

        if (!types.length) {
          try {
            types = await fnGetFilterFields({ projectId });
          } catch (e) {
            console.error(e);
            return result;
          }
        }

        result.push({
          id: timestamp++,
          type: types.find((type) => type.field === filter.field),
          operator: filter.op,
          connector: connectorOptions.find((item) => item.value === filter.connector) ?? null,
          value,
          checked: true
        });
      }

      return result;
    },
    [fnGetFilterFields, fnGetFilterFieldValues, values, filterTypes, projectId]
  );

  const parseGroups = useCallback(
    async (groups) => {
      const filterGroups = [];
      for (const group of groups) {
        const filters = await parseFilters(group.and_clauses);
        filterGroups.push({ filters });
      }

      return filterGroups;
    },
    [parseFilters]
  );

  const deparseFilters = useCallback((filters) => {
    const clauses = [];
    for (const filter of filters) {
      if (filter?.type) {
        const item = {
          caption: filter.type.caption,
          field: filter.type.field,
          op: filter.operator,
          op_type: filter.type.op_type,
          connector: filter.connector?.value
        };

        if (!operatorsWithoutValue.includes(filter.operator)) {
          let itemValue = '';
          if (typeof filter.value === 'string') {
            itemValue = filter.value;
          } else if (Array.isArray(filter.value)) {
            itemValue = filter.value.map((p) => p.name);
          } else {
            itemValue = filter.value?.name ?? '';
          }

          item.value = itemValue;
        }
        clauses.push(item);
      }
    }

    return clauses;
  }, []);

  const deparseGroups = useCallback(
    (groups) => {
      const result = [];
      let idx = 0;
      for (const group of groups) {
        const groupItem = {
          and_clauses: deparseFilters(group.filters),
          group_name: `Group ${++idx}`
        };

        result.push(groupItem);
      }
      return result;
    },
    [deparseFilters]
  );

  return (
    <FilterContext.Provider
      value={{
        filterTypes,
        values,
        loading,
        error,
        filters,
        setFilters,
        checkedFilters,
        query,
        setQuery,
        queryType,
        setQueryType,
        getFieldValues,
        parseFilters,
        parseGroups,
        deparseGroups,
        deparseFilters,
        operatorsWithArrayValue,
        operatorsWithoutValue
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
export const useFilterContext = () => useContext(FilterContext);
