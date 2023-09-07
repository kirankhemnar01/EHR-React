import { createContext, useContext, useCallback } from 'react';

import useAida from 'hooks/useAida';
import { useEntityTags } from 'service/entities';

const SearchFacetsContext = createContext(null);

export const SearchFacetsContextProvider = ({
  projectId,
  searchResults,
  facetData,
  setFacetData,
  onFacetChanged,
  dateFacetSourceData,
  entityType = 'document',
  showDateFacet = true,
  children
}) => {
  let title;
  if (entityType === 'document') title = `${searchResults?.total_count ?? 0} Documents`;
  else if (entityType === 'entity') title = `${searchResults?.total_count ?? 0} Entities`;

  const { getTagDefinitionById, tagGroups: tagGroupsData } = useAida();
  const { data: tagGroups } = tagGroupsData;

  const getDocTagFn = useCallback((tagId) => getTagDefinitionById(tagId, tagGroups), [getTagDefinitionById, tagGroups]);

  const { data: entityTags } = useEntityTags(projectId);
  const getEntityTagFn = useCallback((tagId) => (entityTags || []).find((t) => t.tag_id === tagId), [entityTags]);

  let getTagFn = getDocTagFn;
  if (entityType === 'entity') getTagFn = getEntityTagFn;

  return (
    <SearchFacetsContext.Provider
      value={{
        title,
        searchResults,
        facetData,
        setFacetData,
        onFacetChanged,
        showDateFacet,
        dateFacetSourceData,
        getTagFn
      }}
    >
      {children}
    </SearchFacetsContext.Provider>
  );
};

export const useSearchFacetsContext = () => useContext(SearchFacetsContext);
export default SearchFacetsContext;
