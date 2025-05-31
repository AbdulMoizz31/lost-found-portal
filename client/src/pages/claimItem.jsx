import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import {
  Camera, Upload, X, User, Mail, Phone, MapPin,
  Calendar, FileText, CheckCircle
} from 'lucide-react';
import { doc, getDoc } from "firebase/firestore";
import {db} from "../services/firebase"; // Your Firebase config file
import { toast, ToastContainer } from 'react-toastify';

const getDocById = async (id) => {
  const docRef = doc(db, "items", id); // "users" is the collection name
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    console.log("No such document!");
  }
};
const ClaimItemForm = () => {
  const { id: itemId } = useParams(); // get item ID from URL
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [item, setItem] = useState([])
  const itemData = {
    id: itemId || 'ITEM-001',
    name: 'iPhone 13 Pro',
    category: 'Electronics',
    location: 'Library - 2nd Floor',
    dateFound: '2024-05-25',
    description: 'Black iPhone with blue case, found near the study tables'
  };

  const validationSchema = Yup.object({
    fullName: Yup.string().min(2).required('Full name is required'),
    email: Yup.string().email().required('Email is required'),
    phone: Yup.string().matches(/^[\+]?[0-9\s\-()]+$/, 'Invalid phone number').min(10).required(),
    studentId: Yup.string().matches(/^[A-Za-z0-9\-]+$/).required('Student/Employee ID is required'),
    userType: Yup.string().oneOf(['student', 'teacher', 'faculty']).required(),
    department: Yup.string().required(),
    claimDescription: Yup.string().min(20).max(500).required(),
    lostLocation: Yup.string().required(),
    lostDate: Yup.date().max(new Date()).required(),
    additionalDetails: Yup.string().max(300),
    agreeToTerms: Yup.boolean().oneOf([true], 'You must agree').required()
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const images = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    setUploadedImages(prev => [...prev, ...images].slice(0, 5));
  };

  const removeImage = (id) => {
    setUploadedImages(prev => {
      const removed = prev.find(img => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return prev.filter(img => img.id !== id);
    });
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    await new Promise(res => setTimeout(res, 1500));
    const data = {
      ...values,
      itemId,
      images: uploadedImages.map(i => i.name),
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    const handleClaim = async (item) => {
    try {
      await addDoc(collection(db, "claimRequests"), {
        ...data      });
        toast.success('successful')
    } catch {
      toast.error('error')
    }
  };
  handleClaim()
    console.log('Submitted Claim:', data);
    setIsSubmitted(true);
    resetForm();
    setUploadedImages([]);
    setSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className="container py-5">
        <ToastContainer />
        <div className="card shadow p-5 text-center">
          <CheckCircle size={64} className="text-success mb-3" />
          <h2 className="mb-3">Claim Submitted Successfully!</h2>
          <p className="text-muted mb-3">
            Claim for <strong>{itemData.name}</strong> is now pending review.
            You will be notified via email.
          </p>
          <div className="alert alert-light">
            <strong>Claim ID:</strong> CLM-{Math.random().toString(36).substr(2, 9).toUpperCase()}
          </div>
          <button className="btn btn-primary mt-3" onClick={() => setIsSubmitted(false)}>
            Submit Another Claim
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      
      <div className="card shadow p-4">
        <Formik
          initialValues={{
            fullName: '', email: '', phone: '', studentId: '',
            userType: '', department: '', claimDescription: '',
            lostLocation: '', lostDate: '', additionalDetails: '',
            agreeToTerms: false
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              {/* Personal Info */}
              <div className="mb-4">
                <h5><User size={18} className="me-2" /> Personal Info</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label>Full Name</label>
                    <Field className="form-control" name="fullName" placeholder="Full Name" />
                    <ErrorMessage name="fullName" component="div" className="text-danger small" />
                  </div>
                  <div className="col-md-6">
                    <label>Email</label>
                    <Field className="form-control" name="email" placeholder="Email" />
                    <ErrorMessage name="email" component="div" className="text-danger small" />
                  </div>
                  <div className="col-md-6">
                    <label>Phone</label>
                    <Field className="form-control" name="phone" placeholder="Phone" />
                    <ErrorMessage name="phone" component="div" className="text-danger small" />
                  </div>
                  <div className="col-md-6">
                    <label>Student/Employee ID</label>
                    <Field className="form-control" name="studentId" placeholder="ID" />
                    <ErrorMessage name="studentId" component="div" className="text-danger small" />
                  </div>
                  <div className="col-md-6">
                    <label>User Type</label>
                    <Field as="select" name="userType" className="form-select">
                      <option value="">Select</option>
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="faculty">Faculty</option>
                    </Field>
                    <ErrorMessage name="userType" component="div" className="text-danger small" />
                  </div>
                  <div className="col-md-6">
                    <label>Department</label>
                    <Field className="form-control" name="department" placeholder="Department" />
                    <ErrorMessage name="department" component="div" className="text-danger small" />
                  </div>
                </div>
              </div>

              {/* Claim Details */}
              <div className="mb-4">
                <h5><FileText size={18} className="me-2" /> Claim Details</h5>
                <div className="mb-3">
                  <label>Why does this item belong to you?</label>
                  <Field as="textarea" name="claimDescription" rows={4} className="form-control" />
                  <div className="text-end small text-muted">{values.claimDescription.length}/500</div>
                  <ErrorMessage name="claimDescription" component="div" className="text-danger small" />
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label>Lost Location</label>
                    <Field className="form-control" name="lostLocation" placeholder="Where you lost it" />
                    <ErrorMessage name="lostLocation" component="div" className="text-danger small" />
                  </div>
                  <div className="col-md-6">
                    <label>Lost Date</label>
                    <Field type="date" className="form-control" name="lostDate" />
                    <ErrorMessage name="lostDate" component="div" className="text-danger small" />
                  </div>
                  <div className="col-12">
                    <label>Additional Details</label>
                    <Field as="textarea" name="additionalDetails" rows={2} className="form-control" />
                    <ErrorMessage name="additionalDetails" component="div" className="text-danger small" />
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="mb-4">
                <h5><Camera size={18} className="me-2" /> Upload Images (max 5)</h5>
                <input type="file" multiple accept="image/*" className="form-control" onChange={handleImageUpload} />
                <div className="d-flex flex-wrap gap-3 mt-2">
                  {uploadedImages.map(img => (
                    <div key={img.id} className="position-relative">
                      <img src={img.preview} alt={img.name} height="100" className="rounded" />
                      <button type="button" className="btn-close position-absolute top-0 end-0" onClick={() => removeImage(img.id)}></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms */}
              <div className="form-check mb-3">
                <Field type="checkbox" className="form-check-input" name="agreeToTerms" id="agreeToTerms" />
                <label className="form-check-label" htmlFor="agreeToTerms">
                  I confirm that the above information is accurate and truthful.
                </label>
                <ErrorMessage name="agreeToTerms" component="div" className="text-danger small" />
              </div>

              <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Claim'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ClaimItemForm;
