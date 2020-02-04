export default class PDFJs {
  init = (source, password, element) => {
    const iframe = document.createElement("iframe");

    iframe.src = `/pdfjs-2.2.228-dist/web/viewer.html?file=${source}&password=${password}`;
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.toolbar = "none";

    element.appendChild(iframe);
  };
}
