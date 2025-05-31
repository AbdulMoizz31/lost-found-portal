import React from 'react';
import { Package } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { Camera, Upload, X, User, Mail, Phone, MapPin, Calendar, FileText, CheckCircle } from 'lucide-react';

const AddItemForm = () => {
      const [uploadedImages, setUploadedImages] = useState([]);
  const validationSchema = Yup.object({
    title: Yup.string()
      .min(3, 'Title must be at least 3 characters')
      .required('Title is required'),
    description: Yup.string()
      .min(10, 'Description must be at least 10 characters')
      .required('Description is required'),
    category: Yup.string().required('Category is required'),
    location: Yup.string().required('Location is required'),
    date: Yup.date()
      .max(new Date(), 'Date cannot be in the future')
      .required('Date is required'),
    status: Yup.string().required('Status is required'),
    contactName: Yup.string().required('Contact name is required'),
    contactEmail: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    contactPhone: Yup.string()
      .matches(/^(\+92|0)?[0-9]{10,11}$/, 'Please enter a valid phone number')
      .required('Phone number is required')
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
  const initialValues = {
    title: '',
    description: '',
    category: '',
    location: '',
    date: '',
    status: 'lost',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  };

  const categories = [
    'Electronics',
    'Clothing',
    'Bags',
    'Books',
    'Accessories',
    'Documents',
    'Keys',
    'Jewelry',
    'Other'
  ];

  const handleSubmit = (values) => {
    console.log('Form submitted:', values);
    alert('Item added successfully!');
  };

  return (
    <div className="container-fluid ">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="text-center mb-4 mt-4">
              <h2 className="text-dark fw-light">
                <Package className="me-3" size={32} />
                Add Item
              </h2>
              <hr className="w-25 mx-auto" />
            </div>
            <div className="card shadow-sm shadow-sm">
              <div className="card-body p-5">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-4">
                          <label className="form-label fw-semibold text-muted small text-uppercase">Item Title *</label>
                          <Field
                            type="text"
                            name="title"
                            className="form-control"
                            placeholder="e.g., iPhone 13 Pro"
                          />
                          <ErrorMessage name="title" component="div" className="text-danger small mt-1" />
                        </div>

                        <div className="mb-4">
                          <label className="form-label fw-semibold text-muted small text-uppercase">Category *</label>
                          <Field as="select" name="category" className="form-select">
                            <option value="">Select category</option>
                            {categories.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </Field>
                          <ErrorMessage name="category" component="div" className="text-danger small mt-1" />
                        </div>

                        <div className="mb-4">
                          <label className="form-label fw-semibold text-muted small text-uppercase">Location *</label>
                          <Field
                            type="text"
                            name="location"
                            className="form-control"
                            placeholder="e.g., Library 2nd Floor"
                          />
                          <ErrorMessage name="location" component="div" className="text-danger small mt-1" />
                        </div>

                        <div className="mb-4">
                          <label className="form-label fw-semibold text-muted small text-uppercase">Date *</label>
                          <Field
                            type="date"
                            name="date"
                            className="form-control "
                            max={new Date().toISOString().split('T')[0]}
                          />
                          <ErrorMessage name="date" component="div" className="text-danger small mt-1" />
                        </div>

                        <div className="mb-4">
                          <label className="form-label fw-semibold text-muted small text-uppercase">Status *</label>
                          <div className="mt-3">
                            <div className="form-check form-check-inline me-4">
                              <Field
                                type="radio"
                                name="status"
                                value="lost"
                                id="lost"
                                className="form-check-input"
                              />
                              <label htmlFor="lost" className="form-check-label text-danger fw-semibold">
                                Lost
                              </label>
                            </div>
                            <div className="form-check form-check-inline">
                              <Field
                                type="radio"
                                name="status"
                                value="found"
                                id="found"
                                className="form-check-input"
                              />
                              <label htmlFor="found" className="form-check-label text-success fw-semibold">
                                Found
                              </label>
                            </div>
                          </div>
                          <ErrorMessage name="status" component="div" className="text-danger small mt-1" />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-4">
                          <label className="form-label fw-semibold text-muted small text-uppercase">Description *</label>
                          <Field
                            as="textarea"
                            name="description"
                            rows="4"
                            className="form-control"
                            placeholder="Detailed description of the item..."
                          />
                          <ErrorMessage name="description" component="div" className="text-danger small mt-1" />
                        </div>

                        <div className="mb-4">
                          <label className="form-label fw-semibold text-muted small text-uppercase">Your Name *</label>
                          <Field
                            type="text"
                            name="contactName"
                            className="form-control"
                            placeholder="Your full name"
                          />
                          <ErrorMessage name="contactName" component="div" className="text-danger small mt-1" />
                        </div>

                        <div className="mb-4">
                          <label className="form-label fw-semibold text-muted small text-uppercase">Email *</label>
                          <Field
                            type="email"
                            name="contactEmail"
                            className="form-control"
                            placeholder="your@email.com"
                          />
                          <ErrorMessage name="contactEmail" component="div" className="text-danger small mt-1" />
                        </div>

                        <div className="mb-4">
                          <label className="form-label fw-semibold text-muted small text-uppercase">Phone Number *</label>
                          <Field
                            type="tel"
                            name="contactPhone"
                            className="form-control "
                            placeholder="+92-300-1234567"
                          />
                          <ErrorMessage name="contactPhone" component="div" className="text-danger small mt-1" />
                        </div>
                      </div>
                    </div>
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
      </div>
    </div>
  );
};

export default AddItemForm;