import React from 'react';
import { Grid, Typography, Popover, InputLabel } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export const FormControl = ({ label, element, helper, sx = {}, labelSx = {}, wrapped = true }) => {
	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => setAnchorEl(null);

	const content = (
		<>
			<Grid item xs={12} sm={4}>
				<Typography
					variant='body1'
					sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1, ...labelSx }}
				>
					{label}	{!!helper && <HelpOutlineIcon sx={{ fontSize: 16, cursor: 'pointer' }} onClick={handleClick} />}
				</Typography>
			</Grid>
			<Grid item xs={12} sm={8}>
				{element}
			</Grid>
			{!!helper && (
				<Popover
					open={!!anchorEl}
					anchorEl={anchorEl}
					onClose={handleClose}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'left',
					}}
				>
					<Typography sx={{ p: 1, width: 320 }}>{helper}</Typography>
				</Popover>
			)}
		</>
	)
	return wrapped ? (
		<Grid
			container
			sx={{
				borderBottom: '1px solid #eeeeee',
				alignItems: 'center',
				py: 2,
				...sx
			}}
		>
			{content}
		</Grid>
	) : content;
};

export const FormInput = ({ label, element }) => (
	<Grid container sx={{ alignItems: 'center' }}>
		<Grid item xs={12} sm={3} sx={{ pt: { xs: 2, sm: '0 !important' } }}>
			<InputLabel sx={{ fontSize: '0.875rem', color: theme => theme.palette.grey[900] }}>{label}</InputLabel>
		</Grid>
		<Grid item xs={12} sm={9}>
			{element}
		</Grid>
	</Grid>
);
