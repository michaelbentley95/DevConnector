import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { resetPassword, checkResetToken } from "../../actions/authActions";
import TextFieldGroup from "../common/TextFieldGroup";
import classnames from "classnames";

class ResetPassword extends Component {
  constructor() {
    super();
    this.state = {
      password: "",
      password2: "",
      success: {},
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  validToken(token) {
    this.props.checkResetToken(token);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  //Send the user to the dashboard if they're already signed in
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
    if (!this.props.match.params.token) {
      this.props.history.push("/login");
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
      token: this.props.match.params.token,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.resetPassword(userData);
  }

  render() {
    const { errors, success } = this.state;

    return (
      <div className="resetPassword">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Reset Password</h1>
              <p className="lead text-center">
                Set new password for your account
              </p>
              <form noValidate onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                />
                <TextFieldGroup
                  placeholder="Confirm Password"
                  name="password2"
                  type="password"
                  value={this.state.password2}
                  onChange={this.onChange}
                  error={errors.password2}
                />
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ResetPassword.propTypes = {
  resetPassword: PropTypes.func.isRequired,
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
  { resetPassword }
)(ResetPassword);
