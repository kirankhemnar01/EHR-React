import { DEFAULT_PAGE_SIZE } from 'config';

import usePagination from '@mui/material/usePagination';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Box, Stack, Chip, Typography, IconButton } from '@mui/material';

const UsePagination = ({ totalCount, page, onChange, bgcolor = 'rgb(0 0 0 / 2%)', totalPages = 0, pageSize = DEFAULT_PAGE_SIZE }) => {
    const { items } = usePagination({
        count: totalPages,
        page,
        onChange
    });

    const previousBtn = items.find((item) => item.type === 'previous');
    const nextBtn = items.find((item) => item.type === 'next');
    let start = (page - 1) * pageSize + 1;
    let end = start + pageSize - 1;
    if (end > totalCount) end = totalCount;
    if (start > totalCount) start = 0;

    return (
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center' }}>
            <Chip
                sx={{ bgcolor }}
                label={
                    <Box>
                        <Typography variant="body2" component="span">
                            {`${start}-${end} of ${totalCount}`}
                        </Typography>
                        <IconButton variant="text" size="small" disabled={previousBtn.disabled} onClick={previousBtn.onClick}>
                            <NavigateBeforeIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton variant="text" size="small" disabled={nextBtn.disabled} onClick={nextBtn.onClick}>
                            <NavigateNextIcon fontSize="inherit" />
                        </IconButton>
                    </Box>
                }
            />
        </Stack>
    );
};

export default UsePagination;
