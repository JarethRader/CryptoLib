import React from "react";

export default class PDFViewer extends React.Component {
  constructor(props) {
    super(props);
    this.viewerRef = React.createRef();
    this.backend = new props.backend();
  }

  componentDidMount() {
    const { src, password } = this.props;
    console.log(src);
    const element = this.viewerRef.current;

    this.backend.init(src, password, element);
  }

  render() {
    return (
      <div
        ref={this.viewerRef}
        id="viewer"
        style={{ width: "100%", height: "100%" }}
      ></div>
    );
  }
}
