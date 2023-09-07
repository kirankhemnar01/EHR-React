import { Box } from '@mui/material';
import { Divider } from 'ui-component/aida/base/divider';
import { FormControl } from 'ui-component/aida/base/form-control';
import { DropZone } from 'ui-component/aida/dropzone';
import { StorageFileSelect } from './storage-file-select';

export const DndS3UploadFile = ({
	files, fileType,
	onChangeFiles, onDeleteFile,
	url, onChangeUrl,
	storage, setStorage,
	s3HelperText, accept = { 'binary/zip': ['.zip'] },
	labels = false,
	allowFolder = false,
	multiple = false
}) => {
	const dnd = (
		<DropZone {...{ onChangeFiles, onDeleteFile, files, fileType, accept, multiple, allowFolder }} />
	);

	const cloud = (
		<StorageFileSelect {...{ url, onChangeUrl, s3HelperText, storage, setStorage }} />
	)

	return labels ? (
		<>
			<FormControl
				sx={{ border: 'none', py: 1, alignItems: 'flex-start' }}
				label='Local file'
				element={dnd}
			/>
			<FormControl
				sx={{ border: 'none', py: 1 }}
				label=''
				element={<Divider sx={{ my: 1 }} lineColor='300' textColor='900' />}
			/>
			<FormControl
				sx={{ border: 'none', py: 1, alignItems: 'flex-start' }}
				label='Cloud storage'
				element={cloud}
			/>
		</>
	) : (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
			{dnd}
			<Divider sx={{ my: 1 }} lineColor='300' textColor='900' />
			{cloud}
		</Box>
	)
}
