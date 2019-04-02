import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { createPart } from "../../actions/partActions";

class CreatePart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      partNumber: "",
      description: "",
      weight: "",
      shippingConcern: false,
      specialNotes: false,
      MG3: "",
      notice: "",
      successor: "",
      list: "",
      repair: "",
      exchange: "",
      credit: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onShippingConcernCheck = this.onShippingConcernCheck.bind(this);
    this.onSpecialNotesCheck = this.onSpecialNotesCheck.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const partData = {
      partNumber: this.state.partNumber,
      description: this.state.description,
      weight: this.state.weight,
      shippingConcern: this.state.shippingConcern,
      specialNotes: this.state.specialNotes,
      MG3: this.state.MG3,
      notice: this.state.notice,
      successor: this.state.successor,
      list: this.state.list,
      repair: this.state.repair,
      exchange: this.state.exchange,
      credit: this.state.credit
    };

    this.props.createPart(partData, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onShippingConcernCheck(e) {
    this.setState({
      //Essentially toggles these values
      shippingConcern: !this.state.shippingConcern
    });
  }

  onSpecialNotesCheck(e) {
    this.setState({
      //Essentially toggles these values
      specialNotes: !this.state.specialNotes
    });
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="add-part">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to="/dashboard" className="btn btn-light">
                Go Back
              </Link>
              <h1 className="display-4 text-center">Create Part</h1>
              <p className="lead text-center">Add a part to the database</p>
              <small className="d-block pb-3">* = required fields</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="* Part Number"
                  name="partNumber"
                  value={this.state.partNumber}
                  onChange={this.onChange}
                  error={errors.partNumber}
                />
                <TextAreaFieldGroup
                  placeholder="Part Description"
                  name="description"
                  value={this.state.description}
                  onChange={this.onChange}
                  error={errors.description}
                />
                <TextFieldGroup
                  placeholder="* Part Weight"
                  name="weight"
                  value={this.state.weight}
                  onChange={this.onChange}
                  error={errors.weight}
                />
                <TextFieldGroup
                  placeholder="* MG3"
                  name="MG3"
                  value={this.state.MG3}
                  onChange={this.onChange}
                  error={errors.MG3}
                />
                <TextAreaFieldGroup
                  placeholder="Notice for the Customer"
                  name="notice"
                  value={this.state.notice}
                  onChange={this.onChange}
                  error={errors.notice}
                />
                <TextFieldGroup
                  placeholder="Part Successor"
                  name="successor"
                  value={this.state.successor}
                  onChange={this.onChange}
                  error={errors.successor}
                />
                <TextFieldGroup
                  placeholder="List Price"
                  name="list"
                  value={this.state.list}
                  onChange={this.onChange}
                  error={errors.list}
                />
                <TextFieldGroup
                  placeholder="Repair Price"
                  name="repair"
                  value={this.state.repair}
                  onChange={this.onChange}
                  error={errors.repair}
                />
                <TextFieldGroup
                  placeholder="Exchange Price"
                  name="exchange"
                  value={this.state.exchange}
                  onChange={this.onChange}
                  error={errors.exchange}
                />
                <TextFieldGroup
                  placeholder="Core Credit"
                  name="credit"
                  value={this.state.credit}
                  onChange={this.onChange}
                  error={errors.credit}
                />
                <div className="form-check mb-4">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="shippingConcern"
                    value={this.state.shippingConcern}
                    checked={this.state.shippingConcern}
                    onChange={this.onShippingConcernCheck}
                    id="shippingConcern"
                  />
                  <label htmlFor="shippingConcern" className="form-check-label">
                    Shipping Concern?
                  </label>
                </div>
                <div className="form-check mb-4">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="specialNotes"
                    value={this.state.specialNotes}
                    checked={this.state.specialNotes}
                    onChange={this.onSpecialNotesCheck}
                    id="specialNotes"
                  />
                  <label htmlFor="specialNotes" className="form-check-label">
                    Special Notes?
                  </label>
                </div>
                <input
                  type="submit"
                  value="Submit"
                  className="btn btn-info btn-block mt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreatePart.propTypes = {
  errors: PropTypes.object.isRequired,
  createPart: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { createPart }
)(withRouter(CreatePart));
