import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  TextField,
  Typography,
  IconButton,
  SvgIcon,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip
} from '@mui/material';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Option } from 'ui-component/aida/base';
import { StorageApis } from 'service/admin';
import useAuth from 'hooks/useAuth';
import { getExtension, sentryException } from 'helpers';
import { fileTypeIcons, sentryEvents } from 'aida-constants';
import { TreeView, TreeItem } from '@mui/lab';
import { formatTree } from '../../views/workspaces/Uploads/helpers';

const renderTree = (node, onSelect, onItem) => node.type === 'folder' ? (
  <TreeItem
    key={node.key}
    nodeId={node.key}
    label={(
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SvgIcon size={16} inheritViewBox sx={{ width: '16px', height: '16px' }}>
          <FolderOutlinedIcon />
        </SvgIcon>
        <Typography>{node.name}</Typography>
      </Box>
    )}
    onClick={() => onItem(node.key)}
    onDoubleClick={() => onSelect(node.key)}
  >
    {node.nodes.map(item => renderTree(item, onSelect, onItem))}
  </TreeItem>
) : (
  <TreeItem
    key={node.key}
    nodeId={node.key}
    label={(
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SvgIcon
          component={fileTypeIcons[`${getExtension(node.name) || 'file'}FileTypeIcon`]}
          size={16}
          inheritViewBox
          sx={{ width: '16px', height: '16px' }}
        />
        <Typography>{node.name}</Typography>
      </Box>
    )}
    onClick={() => onItem(node.key)}
    onDoubleClick={() => onSelect(node.key)}
  />
);

const FileSelectDialog = ({ root, open, onClose, onSelect }) => {
  const [key, setKey] = useState('');

  const handleSelect = (nodeId) => {
    onSelect(nodeId);
    onClose();
  }

  return (
    <Dialog {...{ open, onClose }} maxWidth='sm' fullWidth>
      <DialogTitle>
        Select a file
      </DialogTitle>
      <DialogContent>
        {!!root && (
          <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{ minHeight: 480, border: '1px solid #F0F0F0', borderRadius: 1 }}
          >
            {renderTree(root, handleSelect, setKey)}
          </TreeView>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ width: 80 }} variant='outlined'>
          Cancel
        </Button>
        <Button
          onClick={() => handleSelect(key)}
          sx={{ width: 120, display: 'flex', alignItems: 'center', gap: 1 }}
          variant='contained'
          disabled={!key}
        >
          Select
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export const StorageFileSelect = ({
  url, onChangeUrl, s3HelperText,
  storage, setStorage
}) => {
  const { user } = useAuth();
  const { projectId } = useParams();
  const storagesRef = useRef(null);
  const captureException = sentryException(user, projectId);

  const [options, setOptions] = useState([]);
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showDialog, setShowDialog] = useState(false);
  const closeDialog = () => setShowDialog(false);
  const openDialog = () => setShowDialog(true);
  const [status, setStatus] = useState('');
  const [validating, setValidating] = useState(false);

  const handleChange = value => {
    setFiles(null);
    setStorage(value);
  }

  const handleOpen = async () => {
    if (!storage) return;

    if (files) {
      openDialog();
      return;
    }

    setLoading(true);
    try {
      const result = await StorageApis.list(storage);
      const tree = formatTree(result);
      setFiles(tree);
      openDialog();
    } catch (e) {
      captureException(e, {
        userEvent: sentryEvents.uploads.listStorage,
        storageId: storage
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const init = async () => {
      try {
        const result = await StorageApis.getAll(user.account_id, '', 0, 10);
        storagesRef.current = result.results ?? [];
        setOptions(result.results.map(item => ({ name: item.name, value: item.storage_id })));
      } catch (e) {
        captureException(e, {
          userEvent: sentryEvents.uploads.getStorages
        });
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelect = (key) => {
    setStatus('');

    const selectedStorage = storagesRef.current?.find(item => item.storage_id === storage);
    const config = selectedStorage?.config;
    if (config) {
      switch (selectedStorage.storage_type) {
        case 's3':
          onChangeUrl(`s3://${config.bucket}/${key}`);
          break;
        case 'azure':
          onChangeUrl(`https://${config.account_name}.blob.core.windows.net/${config.container_name}/${key}`);
          break;
        case 'gcs':
          onChangeUrl(`gs://${config.bucket_name}/${key}`);
          break;
        default:
          break;
      }
    }
  }

  const handleValidate = async () => {
    setValidating(true);
    try {
      const { message } = await StorageApis.validateURL(storage, url);
      if (message.endsWith('True')) setStatus('valid');
      else setStatus('Invalid');
    } catch (e) {
      captureException(e, {
        userEvent: sentryEvents.uploads.validateURL
      });
    } finally {
      setValidating(false);
    }
  }

  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
      <Option
        sx={{ width: '100%', mb: 2 }}
        options={options}
        label='Select a cloud storage'
        value={storage}
        onChange={handleChange}
      />
      <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%', position: 'relative' }}>
        <TextField
          value={url}
          onChange={onChangeUrl}
          sx={{ flexGrow: 1 }}
          error={!!s3HelperText}
          helperText={s3HelperText}
          label='Enter a storage URL'
        />
        {loading ? <CircularProgress size={24} sx={{ m: 1, position: 'absolute', left: '100%' }} /> : (
          <IconButton onClick={handleOpen} disabled={!storage} sx={{ position: 'absolute', left: '100%' }}>
            <FolderOutlinedIcon />
          </IconButton>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
        <Button
          color='inherit'
          variant='outlined'
          sx={{ my: 2, borderColor: theme => theme.palette.grey['400'] }}
          disabled={!storage || !url}
          onClick={handleValidate}
        >
          Validate URL
          {validating && <CircularProgress sx={{ ml: 2 }} size={20} />}
        </Button>

        {!!status && (
          <Chip
            label={status}
            color={status === 'valid' ? 'success' : 'error'}
            variant='outlined'
            size='small'
            sx={{ ml: 2 }}
          />
        )}
      </Box>

      <FileSelectDialog
        root={files}
        open={showDialog}
        onClose={closeDialog}
        onSelect={onSelect}
      />
    </Box>
  );
}
