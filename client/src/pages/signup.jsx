import React, { useState } from "react"
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
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../services/firebase"
import { toast } from "react-toastify"

const SignUp = () => {
  document.title = "Signup | UMT Lost & Found Portal"
  const navigate = useNavigate()
  const [statusMsg, setStatusMsg] = useState(null)

  const handleSignup = async (values, setSubmitting) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      )

      // TODO: Save user role to Firestore or Realtime Database here, e.g.:
      // await setDoc(doc(db, "users", userCredential.user.uid), {
      //   role: values.role,
      //   email: values.email,
      // });
      toast.success("Signup successful!");
      navigate("/login");
      setStatusMsg({ type: "success", text: `Signed up as ${userCredential.user.email} with role ${values.role}` })
      navigate("/") // redirect after success
    } catch (error) {
      setStatusMsg({ type: "error", text: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  const validation = useFormik({
    initialValues: {
      email: "",
      password: "",
      role: "student", // default role
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Please enter your email"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Please enter your password"),
      role: Yup.string()
        .oneOf(["student", "faculty", "admin"], "Invalid role selected")
        .required("Please select a role"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      handleSignup(values, setSubmitting)
    },
  })

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={5}>
          <Card>
            <CardBody className="p-4">
              <div className="text-center mb-4">
                <h5 className="text-primary">Create an Account</h5>
                <p className="text-muted">Sign up to get started</p>
              </div>

              {statusMsg && (
                <Alert color={statusMsg.type === "error" ? "danger" : "success"}>
                  {statusMsg.text}
                </Alert>
              )}

              <Form
                className="form-horizontal"
                onSubmit={e => {
                  e.preventDefault()
                  validation.handleSubmit()
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
                      validation.touched.email && validation.errors.email ? true : false
                    }
                  />
                  <FormFeedback>{validation.errors.email}</FormFeedback>
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
                      validation.touched.password && validation.errors.password ? true : false
                    }
                  />
                  <FormFeedback>{validation.errors.password}</FormFeedback>
                </div>

                <div className="mb-3">
                  <Label htmlFor="role" className="form-label">
                    Select Role
                  </Label>
                  <Input
                    type="select"
                    name="role"
                    id="role"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.role}
                    invalid={
                      validation.touched.role && validation.errors.role ? true : false
                    }
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                  </Input>
                  <FormFeedback>{validation.errors.role}</FormFeedback>
                </div>

                <div className="text-end">
                  <button
                    className="btn btn-primary w-100"
                    type="submit"
                    disabled={validation.isSubmitting}
                  >
                    {validation.isSubmitting ? "Signing Up..." : "Sign Up"}
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <p className="mb-0">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary fw-medium">
                      Login
                    </Link>
                  </p>
                </div>
              </Form>
            </CardBody>
          </Card>

          <div className="mt-3 text-center">
            <p className="text-muted">
              © {new Date().getFullYear()} UMT Lost & Found. Crafted with{" "}
              <i className="mdi mdi-heart text-danger" /> by PixarsArt
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default SignUp
