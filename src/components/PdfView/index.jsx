import React, { PureComponent } from 'react';
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfPreview = (props) => {
  //{ url: 'http://example.com/sample.pdf', httpHeaders: { 'X-CustomHeader': '40359820958024350238508234' }, withCredentials: true }

  const { prfUrl } = props
  return (
    <div className="pdf-view">
      <Document
        file={prfUrl}
        loading={'加载中...'}
      >
        <Page renderTextLayer={false} pageNumber={1} width={800} height={200} loading={'加载中...'} />
      </Document>
    </div>
  );
}

export default PdfPreview;