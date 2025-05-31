import React, { useState } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Camera, Upload, X, User, Mail, Phone, MapPin, Calendar, FileText, CheckCircle } from 'lucide-react';

const ClaimItemForm = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const itemData = {
    id: 'ITEM-001',
    name: 'iPhone 13 Pro',
    category: 'Electronics',
    location: 'Library - 2nd Floor',
    dateFound: '2024-05-25',
    description: 'Black iPhone with blue case, found near the study tables'
  };

  const validationSchema = Yup.object({
    fullName: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .required('Full name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phone: Yup.string()
      .matches(/^[\+]?[0-9\s\-\(\)]+$/, 'Invalid phone number')
      .min(10, 'Phone number must be at least 10 digits')
      .required('Phone number is required'),
    studentId: Yup.string()
      .matches(/^[A-Za-z0-9\-]+$/, 'Invalid student/employee ID format')
      .required('Student/Employee ID is required'),
    userType: Yup.string()
      .oneOf(['student', 'teacher', 'faculty'], 'Please select a valid user type')
      .required('User type is required'),
    department: Yup.string()
      .required('Department is required'),
    claimDescription: Yup.string()
      .min(20, 'Please provide at least 20 characters describing why this item belongs to you')
      .max(500, 'Description cannot exceed 500 characters')
      .required('Claim description is required'),
    lostLocation: Yup.string()
      .required('Please specify where you lost this item'),
    lostDate: Yup.date()
      .max(new Date(), 'Lost date cannot be in the future')
      .required('Lost date is required'),
    additionalDetails: Yup.string()
      .max(300, 'Additional details cannot exceed 300 characters'),
    agreeToTerms: Yup.boolean()
      .oneOf([true], 'You must agree to the terms and conditions')
      .required('Agreement to terms is required')
  });

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file: file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    setUploadedImages(prev => [...prev, ...newImages].slice(0, 5)); // Max 5 images
  };

  const removeImage = (imageId) => {
    setUploadedImages(prev => {
      const updated = prev.filter(img => img.id !== imageId);
      // Clean up object URL
      const removedImage = prev.find(img => img.id === imageId);
      if (removedImage) {
        URL.revokeObjectURL(removedImage.preview);
      }
      return updated;
    });
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const claimData = {
        ...values,
        itemId: itemData.id,
        images: uploadedImages,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };
      
      console.log('Claim submitted:', claimData);
      setIsSubmitted(true);
      resetForm();
      setUploadedImages([]);
    } catch (error) {
      console.error('Error submitting claim:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <link 
          href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
          rel="stylesheet" 
        />
        <div className="min-vh-100 bg-light py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="card shadow">
                  <div className="card-body text-center p-5">
                    <CheckCircle className="text-success mb-4" size={64} />
                    <h2 className="card-title mb-4">Claim Submitted Successfully!</h2>
                    <p className="text-muted mb-4">
                      Your claim for "{itemData.name}" has been submitted and is now pending admin approval. 
                      You will receive an email notification once your claim has been reviewed.
                    </p>
                    <div className="alert alert-light mb-4">
                      <strong>Claim ID:</strong> CLM-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </div>
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="btn btn-primary btn-lg"
                    >
                      Submit Another Claim
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      <div className="min-vh-100 bg-light py-4">
        <div className="container">
          {/* Item Details Header */}
          <div className="card shadow mb-4">
            <div className="card-body">
              <h1 className="card-title h2 mb-4">Claim This Item</h1>
              <div className="alert alert-info">
                <div className="d-flex align-items-start">
                  <div className="me-3">
                   {/*  <div className="bg-secondary rounded d-flex align-items-center justify-content-center" 
                         style={{width: '64px', height: '64px'}}>
                      <Camera className="text-white" size={32} />
                    </div> */}
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="alert-heading">{itemData.name}</h5>
                    <p className="mb-2">{itemData.description}</p>
                    <div className="d-flex flex-wrap gap-3 small text-muted">
                      <span><MapPin size={16} className="me-1" />Found at: {itemData.location}</span>
                      <span><Calendar size={16} className="me-1" />Date: {itemData.dateFound}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Claim Form */}
          <div className="card shadow">
            <div className="card-body p-4">
              <Formik
                initialValues={{
                  fullName: '',
                  email: '',
                  phone: '',
                  studentId: '',
                  userType: '',
                  department: '',
                  claimDescription: '',
                  lostLocation: '',
                  lostDate: '',
                  additionalDetails: '',
                  agreeToTerms: false
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, values, setFieldValue, handleSubmit }) => (
                  <div>
                    {/* Personal Information */}
                    <div className="mb-5">
                      <h4 className="mb-4 d-flex align-items-center">
                        <User size={20} className="me-2" />
                        Personal Information
                      </h4>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Full Name *</label>
                          <Field
                            name="fullName"
                            type="text"
                            className="form-control"
                            placeholder="Enter your full name"
                          />
                          <ErrorMessage name="fullName" component="div" className="text-danger small mt-1" />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Email Address *</label>
                          <Field
                            name="email"
                            type="email"
                            className="form-control"
                            placeholder="your.email@example.com"
                          />
                          <ErrorMessage name="email" component="div" className="text-danger small mt-1" />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Phone Number *</label>
                          <Field
                            name="phone"
                            type="tel"
                            className="form-control"
                            placeholder="+1 (555) 123-4567"
                          />
                          <ErrorMessage name="phone" component="div" className="text-danger small mt-1" />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Student/Employee ID *</label>
                          <Field
                            name="studentId"
                            type="text"
                            className="form-control"
                            placeholder="Enter your ID"
                          />
                          <ErrorMessage name="studentId" component="div" className="text-danger small mt-1" />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">User Type *</label>
                          <Field
                            as="select"
                            name="userType"
                            className="form-select"
                          >
                            <option value="">Select user type</option>
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="faculty">Faculty</option>
                          </Field>
                          <ErrorMessage name="userType" component="div" className="text-danger small mt-1" />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Department *</label>
                          <Field
                            name="department"
                            type="text"
                            className="form-control"
                            placeholder="e.g., Computer Science, Mathematics"
                          />
                          <ErrorMessage name="department" component="div" className="text-danger small mt-1" />
                        </div>
                      </div>
                    </div>

                    {/* Claim Details */}
                    <div className="mb-5">
                      <h4 className="mb-4 d-flex align-items-center">
                        <FileText size={20} className="me-2" />
                        Claim Details
                      </h4>
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label">Why do you believe this item belongs to you? *</label>
                          <Field
                            as="textarea"
                            name="claimDescription"
                            rows="4"
                            className="form-control"
                            placeholder="Please provide detailed information about the item, including unique features, when you lost it, etc."
                          />
                          <div className="d-flex justify-content-between small text-muted mt-1">
                            <ErrorMessage name="claimDescription" component="div" className="text-danger" />
                            <span>{values.claimDescription.length}/500</span>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Where did you lose this item? *</label>
                          <Field
                            name="lostLocation"
                            type="text"
                            className="form-control"
                            placeholder="e.g., Library 2nd floor, Cafeteria"
                          />
                          <ErrorMessage name="lostLocation" component="div" className="text-danger small mt-1" />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">When did you lose it? *</label>
                          <Field
                            name="lostDate"
                            type="date"
                            className="form-control"
                          />
                          <ErrorMessage name="lostDate" component="div" className="text-danger small mt-1" />
                        </div>

                        <div className="col-12">
                          <label className="form-label">Additional Details (Optional)</label>
                          <Field
                            as="textarea"
                            name="additionalDetails"
                            rows="3"
                            className="form-control"
                            placeholder="Any additional information that might help verify your claim"
                          />
                          <div className="d-flex justify-content-between small text-muted mt-1">
                            <ErrorMessage name="additionalDetails" component="div" className="text-danger" />
                            <span>{values.additionalDetails.length}/300</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div className="mb-5">
                      <h4 className="mb-4 d-flex align-items-center">
                        <Camera size={20} className="me-2" />
                        Supporting Images (Optional)
                      </h4>
                      <div className="card border-2 border-dashed">
                        <div className="card-body text-center p-4">
                          <Upload className="text-muted mb-3" size={48} />
                          <p className="text-muted mb-3">
                            Upload images that can help verify your claim (receipts, photos of the item, etc.)
                          </p>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="d-none"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="btn btn-primary"
                          >
                            Choose Images
                          </label>
                          <p className="small text-muted mt-2 mb-0">Maximum 5 images, up to 10MB each</p>
                        </div>

                        {uploadedImages.length > 0 && (
                          <div className="card-body border-top">
                            <h6 className="mb-3">Uploaded Images:</h6>
                            <div className="row g-3">
                              {uploadedImages.map((image) => (
                                <div key={image.id} className="col-6 col-md-4 col-lg-3">
                                  <div className="position-relative">
                                    <img
                                      src={image.preview}
                                      alt={image.name}
                                      className="img-fluid rounded border"
                                      style={{height: '100px', objectFit: 'cover', width: '100%'}}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeImage(image.id)}
                                      className="btn btn-danger btn-sm position-absolute top-0 end-0 translate-middle rounded-circle p-1"
                                      style={{width: '24px', height: '24px'}}
                                    >
                                      <X size={14} />
                                    </button>
                                    <p className="small text-muted mt-1 mb-0 text-truncate">{image.name}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="mb-4">
                      <div className="form-check">
                        <Field
                          name="agreeToTerms"
                          type="checkbox"
                          className="form-check-input"
                          id="agreeToTerms"
                        />
                        <label className="form-check-label" htmlFor="agreeToTerms">
                          I agree to the terms and conditions *
                        </label>
                      </div>
                      <div className="form-text">
                        By submitting this claim, I confirm that all information provided is accurate and that I am the rightful owner of this item. 
                        I understand that false claims may result in disciplinary action.
                      </div>
                      <ErrorMessage name="agreeToTerms" component="div" className="text-danger small mt-1" />
                    </div>

                    {/* Submit Button */}
                    <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => window.history.back()}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="btn btn-primary d-flex align-items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="spinner-border spinner-border-sm" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            Submitting...
                          </>
                        ) : (
                          'Submit Claim'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClaimItemForm;