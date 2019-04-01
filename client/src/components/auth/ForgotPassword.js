import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { forgotPassword } from "../../actions/authActions";
import TextFieldGroup from "../common/TextFieldGroup";
import classnames from "classnames";

class ForgotPassword extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      success: {},
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  //Send the user to the dashboard if they're already signed in
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  //Sets the component state of errors using the state delivered through the props from redux
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.success) {
      this.setState({ success: nextProps.success });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    this.setState({ errors: {}, success: {} });

    const userData = {
      email: this.state.email
    };

    this.props.forgotPassword(userData);
  }

  render() {
    const { errors, success } = this.state;

    return (
      <div className="forgotPassword">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Forgot Password</h1>
              <p className="lead text-center">
                Send an email to reset password
              </p>
              <form noValidate onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="Email Address"
                  name="email"
                  type="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                />
                <input
                  type="submit"
                  className={classnames("btn btn-info btn-block mt-4", {
                    "d-none": success.reset //if success.reset exists, then it includes "is-invalid" as a class
                  })}
                  value="Send Reset Email"
                />
              </form>
              <h5 className="text-muted">{success.reset}</h5>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ForgotPassword.propTypes = {
  forgotPassword: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  success: state.success
});

export default connect(
  mapStateToProps,
  { forgotPassword }
)(ForgotPassword);
