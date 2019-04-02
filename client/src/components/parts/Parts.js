import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import PartItem from "./PartItem";
import Spinner from "../common/Spinner";
import { getParts } from "../../actions/partActions";

class Parts extends Component {
  componentDidMount() {
    this.props.getParts();
  }

  render() {
    const { parts, loading } = this.props.part;
    let partContent;

    if (parts === null || loading) {
      partContent = <Spinner />;
    } else {
      partContent = parts.map(part => <PartItem key={part._id} part={part} />);
    }

    return (
      <div className="feed">
        <div className="container">
          <div className="row">
            <div className="col-md-12">{partContent}</div>
          </div>
        </div>
      </div>
    );
  }
}

Parts.propTypes = {
  getParts: PropTypes.func.isRequired,
  part: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  part: state.part
});

export default connect(
  mapStateToProps,
  { getParts }
)(Parts);
