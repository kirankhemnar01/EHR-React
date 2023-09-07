import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { TableBody, TableCell, TableHead, TableRow, Box, Checkbox } from '@mui/material';

import { DEFAULT_PAGE_SIZE } from 'config';
import { useFilterContext } from 'contexts/filter';
import { useSorterContext } from 'contexts/sorter';
import useAida from 'hooks/useAida';
import useAuth from 'hooks/useAuth';
import { extractFinalTags, toSimpleString } from 'helpers';
import { createLearningTaskBatchAnnotations } from 'service/learning';
import { updateReviewBatchTasks } from 'service/review-batches';
import { createReviewAssignmentBatchAnnotations } from 'service/review-assignments';
import Loader from 'ui-component/Loader';
import { ExpandableDocTagList, UserAvatar } from 'ui-component/aida/base';
import { SearchTable } from 'ui-component/aida/search-table';
import { SelectionBar } from 'ui-component/aida/selection-bar';
import { BulkAnnotations } from 'ui-component/aida/bulk-annotations';
import { BatchTaskUpdater } from 'ui-component/aida/batch-task-updater';
import { DocName, DocId } from 'ui-component/aida';
import { learningTaskName, reviewBatchTaskName, locationStateKeys } from 'aida-constants';
import { useTasksContext } from 'contexts/tasks';

const headCells = [
  { id: 1, label: 'Task ID', numeric: true },
  { id: 2, label: 'Doc ID' },
  { id: 3, label: 'Doc Name' },
  { id: 4, label: 'Doc Date' },
  { id: 5, label: 'Tags' },
  { id: 6, label: 'Reviewers' },
  { id: 7, label: 'Date Created' }
];

export function TasksTable({ onPreview }) {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    user: { time_zone: timezone }
  } = useAuth();
  const { reviewers } = useAida();

  const { projectId, comeFrom, learnerId, reviewBatchId, useTasks, getTaskDocumentRoute } = useTasksContext();

  const { deparseFilters, parseFilters, setFilters: setContextFilters } = useFilterContext();
  const { deparseSorters, parseSorters, setSorters: setContextSorters } = useSorterContext();

  const [selected, setSelected] = useState([]);
  const [allSelected, setAllSelected] = useState(false);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState([]);
  const [sorts, setSorts] = useState([]);

  const { data, error, loading, refetch } = useTasks(
    projectId,
    comeFrom === learningTaskName ? learnerId : reviewBatchId,
    query,
    filters,
    sorts,
    page * pageSize,
    (page + 1) * pageSize
  );

  const onChangePage = (newPage) => {
    setPage(newPage);
  };

  const onChangePageSize = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(0);
  };

  const onSearch = (value) => {
    setPage(0);
    setQuery(value);
  };

  const onFilter = (values) => {
    const clauses = deparseFilters(values);
    setFilters(clauses);
    // whenever the filter conditions change, the page index should be reset to 0
    setPage(0);
  };

  const onSort = (values) => {
    setSorts(deparseSorters(values));
  };

  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) {
      const restoreSearch = async () => {
        // back from doc view page, restore search from navigate data
        const navigateData = location.state && location.state[locationStateKeys.NavigateData];
        if (navigateData) {
          setQuery(navigateData.query ?? '');
          const filters = await parseFilters(navigateData.filter_clauses ?? []);
          setContextFilters(filters);
          setFilters(navigateData.filter_clauses ?? []);

          const sorters = await parseSorters(navigateData.sort_clauses ?? []);
          setContextSorters(sorters);
          setSorts(navigateData.sort_clauses ?? []);
        }
      };

      restoreSearch();
      mountedRef.current = true;
    }
  }, [location.state, parseFilters, parseSorters, setContextFilters, setContextSorters]);

  if (!data && loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!data) {
    return <div>No Data</div>;
  }

  const docs = data.results;
  const count = data.results?.length ?? 0;
  const totalCount = data?.total_count ?? 0;

  const goToTaskDocPage = (id) => {
    navigate(getTaskDocumentRoute(id), {
      state: {
        [locationStateKeys.NavigateData]: data?.q ?? null
      }
    });
  };

  const handleTaskRowClick = (row, index) => {
    // disable navigation for review batch task
    if (comeFrom !== reviewBatchTaskName) goToTaskDocPage(row.task_id, index);
  };

  const handleSelectTask = (e, id) => {
    e.stopPropagation();

    const checked = !selected.includes(id);
    if (checked) {
      setSelected([...selected, id]);
    } else {
      setSelected(selected.filter((item) => item !== id));
      setAllSelected(false);
    }
  };

  const handleSelectAll = () => {
    if (selected.length) {
      setSelected([]);
      setAllSelected(false);
    } else {
      setSelected(docs.map((item) => item.doc_id));
    }
  };

  const handlePreview = (e, doc) => {
    e.preventDefault();
    e.stopPropagation();
    onPreview(doc);
  };

  const handleClear = () => {
    setAllSelected(false);
    setSelected([]);
  };

  const handleSelectTotal = () => {
    setAllSelected(true);
    setSelected(docs.map((item) => item.doc_id));
  };

  const onBulkAnnotationsApply = async (action, labels) => {
    const params = {
      doc_ids: selected,
      labels,
      final_tags: extractFinalTags(labels),
      action,
      date_created: new Date().toISOString()
    };

    if (allSelected) {
      params.q = { query, filter_clauses: filters, sort_clauses: sorts };
    }

    if (comeFrom === learningTaskName) {
      await createLearningTaskBatchAnnotations({ projectId, learnerId, params });
    } else {
      await createReviewAssignmentBatchAnnotations({ projectId, reviewBatchId, params });
    }
    await refetch();
  };

  const onBatchTaskUpdaterApply = async (action, reviewers) => {
    const params = {
      doc_ids: selected,
      reviewer_ids: reviewers.map((reviewer) => reviewer.user_id),
      action
    };

    if (allSelected) {
      params.q = { query, filter_clauses: filters, sort_clauses: sorts };
    }

    await updateReviewBatchTasks({ projectId, reviewBatchId, params });
    await refetch();
    // setAllTasksSelected(false);
  };

  let actions = null;
  if (selected.length > 0) {
    if (comeFrom === reviewBatchTaskName) actions = <BatchTaskUpdater onApply={onBatchTaskUpdaterApply} />;
    else actions = <BulkAnnotations tags predictedTags={false} onApply={onBulkAnnotationsApply} />;
  }
  const description =
    selected.length > 0 ? (
      <SelectionBar
        selectedCount={selected.length}
        allSelected={allSelected}
        totalCount={totalCount}
        pageSize={pageSize}
        onSelectAll={handleSelectTotal}
        onClear={handleClear}
      />
    ) : null;

  return (
    <SearchTable
      {...{
        page,
        pageSize,
        onChangePage,
        onChangePageSize,
        loading,
        actions,
        description,
        totalCount,
        onSearch,
        onFilter,
        onSort,
        initialQuery: query
      }}
      containerSx={{ my: 2 }}
    >
      <TableHead sx={{ bgcolor: 'rgba(0, 0, 0, 0.04)' }}>
        <TableRow>
          <TableCell padding="checkbox" sx={{ pl: 1 }}>
            <Checkbox
              color="primary"
              indeterminate={!allSelected && selected.length > 0 && selected.length < count}
              checked={(count > 0 && selected.length === count) || allSelected}
              onChange={handleSelectAll}
              inputProps={{
                'aria-label': 'select all desserts'
              }}
            />
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell key={headCell.id} align={headCell.numeric ? 'center' : 'left'}>
              {headCell.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.results.map((row, idx) => {
          return (
            <TableRow
              hover
              role="checkbox"
              tabIndex={-1}
              key={row.task_id}
              sx={{ cursor: comeFrom === reviewBatchTaskName ? 'inherit' : 'pointer' }}
              onClick={() => handleTaskRowClick(row, idx)}
            >
              <TableCell sx={{ pl: 1 }} padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={allSelected || selected.includes(row.doc_id)}
                  onClick={(e) => handleSelectTask(e, row.doc_id)}
                />
              </TableCell>
              <TableCell align="center">{row.task_id}</TableCell>
              <TableCell align="left" sx={{ color: 'black' }}>
                <DocId doc={row} onPreview={handlePreview} />
              </TableCell>
              <TableCell align="left" sx={{ color: 'black' }}>
                <DocName doc={row} />
              </TableCell>
              <TableCell>{toSimpleString(row.doc_date || '')}</TableCell>
              <TableCell>
                <Box>
                  <ExpandableDocTagList tags={row.tags} />
                </Box>
              </TableCell>
              <TableCell>
                {row.reviewer_ids.map((id) => (
                  <UserAvatar
                    user={reviewers[id]}
                    key={id}
                    sx={{
                      width: 20,
                      height: 20,
                      lineHeight: '20px',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      display: 'inline-flex',
                      ml: 0.5
                    }}
                  />
                ))}
              </TableCell>
              <TableCell>{toSimpleString(row.date_created, timezone)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </SearchTable>
  );
}
