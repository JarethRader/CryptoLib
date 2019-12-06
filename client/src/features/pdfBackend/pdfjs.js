import React from "react";
import { Document } from "react-pdf/dist/entry.webpack";

export default class PDFJs {
  init = (source, element) => {
    const pdfViewer = document.createElement("DOCUMENT");

    pdfViewer.file = source;

    element.appendChild(pdfViewer);
  };
}
