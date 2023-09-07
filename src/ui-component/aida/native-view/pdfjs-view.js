import 'assets/scss/pdf-native-view.scss';

import { Component } from 'react';

import { Box, Typography } from '@mui/material';
import { PdfLoader, PdfHighlighter } from 'react-pdf-highlighter';

import { BACKEND_BASE_URL } from 'config';
import Loader from 'ui-component/Loader';
import httpClient from 'service/base';

export class PdfjsView extends Component {
  constructor(props) {
    super(props);

    const { pdf_path: pdfPath } = props.doc;
    const rawUrl = pdfPath;
    this.state = {
      url: '',
      rawUrl,
      error: ''
    };
  }

  async componentDidMount() {
    const { rawUrl } = this.state;
    try {
      const url = await httpClient.getObjectURL(`${BACKEND_BASE_URL}/static${rawUrl}`);
      this.setState({ url });
    } catch (e) {
      this.setState({ url: '', error: `Failed to get ${BACKEND_BASE_URL}/static${rawUrl}` });
      console.error(e);
    }
  }

  scrollViewerTo = () => {};

  render() {
    const { url, error } = this.state;

    if (error) {
      return (
        <Typography
          variant="body2"
          sx={{
            whiteSpace: 'pre-wrap',
            color: 'error.main',
            p: 1
          }}
        >
          {error}
        </Typography>
      );
    }

    return (
      <Box
        className="PdfjsViewContainer"
        sx={{
          overflow: 'auto',
          width: '100%',
          height: '100%',
          position: 'relative'
        }}
      >
        <PdfLoader url={url} workerSrc="/js/pdfjs-2.11.338-pdf.worker.min.js" beforeLoad={<Loader />}>
          {(pdfDocument) => (
            <PdfHighlighter
              pdfDocument={pdfDocument}
              enableAreaSelection={null}
              scrollRef={() => {}}
              highlights={[]}
              onSelectionFinished={() => null}
            />
          )}
        </PdfLoader>
      </Box>
    );
  }
}
