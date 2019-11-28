export default class PDFTron {
  init = (source, element) => {
    new window.PDFTron.WebViewer(
      {
        path: "../../../WebViewer/lib",
        initialDoc: source,
        disabledElements: [
          "viewControlsButton",
          "viewControlsOverlay",
          "downloadButton",
          "printButton"
        ]
      },
      element
    );
  };
}
