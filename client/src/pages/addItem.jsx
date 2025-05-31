import React, { useState } from 'react';
import { Package, Camera, Upload, X } from 'lucide-react';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { db } from '../services/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { Toast } from 'reactstrap';
  import { ToastContainer, toast } from 'react-toastify';

const AddItemForm = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
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
      .required('Phone number is required'),
  });

  const initialValues = {
    title: '',
    description: '',
    category: '',
    location: '',
    date: '',
    status: 'lost',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
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
    'Other',
  ];

  // Convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    if (uploadedImages.length + files.length > 5) {
      alert('You can only upload up to 5 images');
      return;
    }

    setIsUploading(true);
    
    try {
      const newImages = await Promise.all(
        files.map(async (file) => {
          const base64 = await convertToBase64(file);
          return {
            id: Math.random().toString(36).substr(2, 9),
            file: file,
            preview: URL.createObjectURL(file),
            name: file.name,
            base64: base64,
            size: file.size,
            type: file.type
          };
        })
      );

      setUploadedImages((prev) => [...prev, ...newImages].slice(0, 5));
    } catch (error) {
      console.error('Error processing images:', error);
      alert('Error processing images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (imageId) => {
    setUploadedImages((prev) => {
      const updated = prev.filter((img) => img.id !== imageId);
      const removedImage = prev.find((img) => img.id === imageId);
      if (removedImage) {
        URL.revokeObjectURL(removedImage.preview);
      }
      return updated;
    });
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log('Form submitted:', values);
    console.log('Images:', uploadedImages);
    
    try {
      // Prepare image data for submission
      const imageData = uploadedImages.map(img => ({
        name: img.name,
        base64: img.base64,
        size: img.size,
        type: img.type
      }));

      // Include images in the document data
      const documentData = {
        ...values,
        images: imageData,
        imageCount: imageData.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const res = await addDoc(collection(db, 'items'), documentData);
      console.log('Document added with ID:', res.id);

      if (res) {
/*         alert('Item added successfully'); */
      /*   resetForm(); */
        setUploadedImages([]);
        toast.success('item added successfully')
        // Clean up preview URLs
        uploadedImages.forEach(img => {
          if (img.preview) {
            URL.revokeObjectURL(img.preview);
          }
        });
      }
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Error adding item: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="container-fluid ">
      <ToastContainer />
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
            <div className="card shadow-sm">
              <div className="card-body p-5">
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                  }) => (
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-6">
                          {/* Title */}
                          <div className="mb-4">
                            <label className="form-label fw-semibold text-muted small text-uppercase">
                              Item Title *
                            </label>
                            <input
                              type="text"
                              name="title"
                              className="form-control"
                              placeholder="e.g., iPhone 13 Pro"
                              value={values.title}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <ErrorMessage
                              name="title"
                              component="div"
                              className="text-danger small mt-1"
                            />
                          </div>

                          {/* Category */}
                          <div className="mb-4">
                            <label className="form-label fw-semibold text-muted small text-uppercase">
                              Category *
                            </label>
                            <select
                              name="category"
                              className="form-select"
                              value={values.category}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                              <option value="">Select category</option>
                              {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                            <ErrorMessage
                              name="category"
                              component="div"
                              className="text-danger small mt-1"
                            />
                          </div>

                          {/* Location */}
                          <div className="mb-4">
                            <label className="form-label fw-semibold text-muted small text-uppercase">
                              Location *
                            </label>
                            <input
                              type="text"
                              name="location"
                              className="form-control"
                              placeholder="e.g., Library 2nd Floor"
                              value={values.location}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <ErrorMessage
                              name="location"
                              component="div"
                              className="text-danger small mt-1"
                            />
                          </div>

                          {/* Date */}
                          <div className="mb-4">
                            <label className="form-label fw-semibold text-muted small text-uppercase">
                              Date *
                            </label>
                            <input
                              type="date"
                              name="date"
                              className="form-control"
                              max={new Date().toISOString().split('T')[0]}
                              value={values.date}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <ErrorMessage
                              name="date"
                              component="div"
                              className="text-danger small mt-1"
                            />
                          </div>

                          {/* Status */}
                          <div className="mb-4">
                            <label className="form-label fw-semibold text-muted small text-uppercase">
                              Status *
                            </label>
                            <div className="mt-3">
                              <div className="form-check form-check-inline me-4">
                                <input
                                  type="radio"
                                  name="status"
                                  id="lost"
                                  value="lost"
                                  checked={values.status === 'lost'}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="form-check-input"
                                />
                                <label
                                  htmlFor="lost"
                                  className="form-check-label text-danger fw-semibold"
                                >
                                  Lost
                                </label>
                              </div>
                              <div className="form-check form-check-inline">
                                <input
                                  type="radio"
                                  name="status"
                                  id="found"
                                  value="found"
                                  checked={values.status === 'found'}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="form-check-input"
                                />
                                <label
                                  htmlFor="found"
                                  className="form-check-label text-success fw-semibold"
                                >
                                  Found
                                </label>
                              </div>
                            </div>
                            <ErrorMessage
                              name="status"
                              component="div"
                              className="text-danger small mt-1"
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          {/* Description */}
                          <div className="mb-4">
                            <label className="form-label fw-semibold text-muted small text-uppercase">
                              Description *
                            </label>
                            <textarea
                              name="description"
                              rows="4"
                              className="form-control"
                              placeholder="Detailed description of the item..."
                              value={values.description}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <ErrorMessage
                              name="description"
                              component="div"
                              className="text-danger small mt-1"
                            />
                          </div>

                          {/* Contact Name */}
                          <div className="mb-4">
                            <label className="form-label fw-semibold text-muted small text-uppercase">
                              Your Name *
                            </label>
                            <input
                              type="text"
                              name="contactName"
                              className="form-control"
                              placeholder="Your full name"
                              value={values.contactName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <ErrorMessage
                              name="contactName"
                              component="div"
                              className="text-danger small mt-1"
                            />
                          </div>

                          {/* Email */}
                          <div className="mb-4">
                            <label className="form-label fw-semibold text-muted small text-uppercase">
                              Email *
                            </label>
                            <input
                              type="email"
                              name="contactEmail"
                              className="form-control"
                              placeholder="your@email.com"
                              value={values.contactEmail}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <ErrorMessage
                              name="contactEmail"
                              component="div"
                              className="text-danger small mt-1"
                            />
                          </div>

                          {/* Phone Number */}
                          <div className="mb-4">
                            <label className="form-label fw-semibold text-muted small text-uppercase">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              name="contactPhone"
                              className="form-control"
                              placeholder="+92-300-1234567"
                              value={values.contactPhone}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <ErrorMessage
                              name="contactPhone"
                              component="div"
                              className="text-danger small mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Image Upload */}
                      <div className="mb-4">
                        <label className="form-label fw-semibold text-muted small text-uppercase d-flex align-items-center gap-2">
                          Upload Images (max 5)
                          <Upload size={20} />
                        </label>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="form-control"
                        />
                        <small className="text-muted">
                          You can upload up to 5 images.
                        </small>

                        {/* Show uploaded image previews with remove */}
                        <div className="d-flex flex-wrap mt-3 gap-3">
                          {uploadedImages.map(({ id, preview, name }) => (
                            <div
                              key={id}
                              className="position-relative border rounded"
                              style={{ width: '100px', height: '100px' }}
                            >
                              <img
                                src={preview}
                                alt={name}
                                className="img-fluid rounded"
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(id)}
                                className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                style={{ borderRadius: '0 0 0.5rem 0' }}
                                aria-label={`Remove image ${name}`}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary w-100 py-2"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : 'Add Item'}
                      </button>
                    </form>
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
