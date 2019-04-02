import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Link } from "react-router-dom";

class PartItem extends Component {
  render() {
    const { part } = this.props;

    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-12">
            <br />
            <h2>{part.partNumber}</h2>
          </div>
          <div className="col-md-10">
            <p className="lead">{part.description}</p>
            <span>
              <Link
                to={`/part/${part.partNumber}`}
                className="btn btn-info mr-1"
              >
                View Part
              </Link>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

PartItem.defaultProps = {
  showActions: true
};

PartItem.propTypes = {
  part: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PartItem);
