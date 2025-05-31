import React from "react"
import {
  Row,
  Col,
  Input,
  Label,
  Form,
  FormFeedback,
  Container,
  Card,
  CardBody,
  Alert,
} from "reactstrap"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Link, useNavigate } from "react-router-dom"


const Login = () => {
  document.title = "Login UMT Lost-found-portal"
  const navigate = useNavigate()

  const validation = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Please enter your email"),
      password: Yup.string().required("Please enter your password"),
    }),
    onSubmit: values => {
      navigate('/')
      console.log("Login submitted:", values)
    },
  })

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={5}>
          
          <Card>
            <CardBody className="p-4">
              <div className="text-center mb-4">
                <h5 className="text-primary">Welcome Back</h5>
                <p className="text-muted">Sign in to continue to Dock Tok</p>
              </div>
              <Form
                className="form-horizontal"
                onSubmit={e => {
                  e.preventDefault()
                  validation.handleSubmit()
                  return false
                }}
              >
                <div className="mb-3">
                  <Label htmlFor="email" className="form-label">
                    Email
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter email"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.email}
                    invalid={
                      validation.touched.email && validation.errors.email
                        ? true
                        : false
                    }
                  />
                  {validation.touched.email && validation.errors.email ? (
                    <FormFeedback>{validation.errors.email}</FormFeedback>
                  ) : null}
                </div>

                <div className="mb-3">
                  <Label htmlFor="password" className="form-label">
                    Password
                  </Label>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter password"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.password}
                    invalid={
                      validation.touched.password && validation.errors.password
                        ? true
                        : false
                    }
                  />
                  {validation.touched.password &&
                  validation.errors.password ? (
                    <FormFeedback>{validation.errors.password}</FormFeedback>
                  ) : null}
                </div>

                <div className="mb-3 text-end">
                  <Link to="/forgot-password" className="text-muted">
                    Forgot password?
                  </Link>
                </div>

                <div className="text-end">
                  <button
                    className="btn btn-primary w-100"
                    type="submit"
                  >
                    Log In
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <p className="mb-0">
                    Don't have an account?{" "}
                    <Link to="/sign-up" className="text-primary fw-medium">
                      Register
                    </Link>
                  </p>
                </div>
              </Form>
            </CardBody>
          </Card>
          <div className="mt-3 text-center">
            <p className="text-muted">
              © {new Date().getFullYear()} Dock Tok. Crafted with{" "}
              <i className="mdi mdi-heart text-danger" /> by PixarsArt
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Login
