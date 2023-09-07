import { Box, Table, Card, TablePagination, TableContainer, Typography } from '@mui/material';
import { Overlay } from './base';
import { SearchBar, SearchInput } from './search-bar';
import { pageSizes } from 'aida-constants';

export const SearchTable = ({
  title,
  fixedLayout,
  children,
  loading,
  totalCount,
  page,
  pageSize,
  actions,
  description,
  onChangePage,
  onChangePageSize,
  onSearch,
  searchComponent,
  onFilter,
  onSort,
  onGroup,
  containerSx,
  sx = {},
  initialQuery = '',
  ...others
}) => {
  const handleChangePage = (_, newPage) => {
    onChangePage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const value = parseInt(event?.target.value, 10);
    onChangePageSize(value);
  };

  return (
    <Box sx={containerSx}>
      {title && (
        <Box component="section" sx={{ margin: '8px 0' }}>
          <Typography variant="h1">{title}</Typography>
        </Box>
      )}

      <Box component="section">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          {searchComponent}
          {onSearch && (
            <SearchBar {...{ onFilter, onSort, onGroup }}>
              <SearchInput onSearch={onSearch} initialValue={initialQuery} />
            </SearchBar>
          )}

          {actions}

          <TablePagination
            rowsPerPageOptions={pageSizes}
            component="div"
            count={totalCount}
            rowsPerPage={pageSize}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Box>

      <Box sx={{ position: 'relative' }}>
        {loading && <Overlay />}

        {description}

        <TableContainer component={Card} sx={{ border: `1px solid #eeeeee` }}>
          <Table
            sx={{
              '& .MuiTableCell-root': { fontSize: 12 },
              position: 'relative',
              tableLayout: fixedLayout ? 'fixed' : 'unset',
              ...sx
            }}
            className="searchable-table"
            size="medium"
            {...others}
          >
            {children}
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
