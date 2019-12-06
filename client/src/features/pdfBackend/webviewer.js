export default class PDFTron {
  init = (source, element) => {
    window
      .WebViewer(
        {
          path: "../../../WebViewer/lib",
          initialDoc: source
        },
        element
      )
      .then(instance => {
        const { docViewer } = instance;
      });
  };
}
