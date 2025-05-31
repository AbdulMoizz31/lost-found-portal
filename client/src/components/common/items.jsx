import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDocs, collection } from "firebase/firestore";
import { db } from '../../services/firebase';
const user = localStorage.getItem('user')
const parsed = JSON.parse(user)
const role = parsed?.role
const fetchAllItems = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "items")); // "items" is your collection name
    const itemList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return itemList;
  } catch (error) {
    console.error("Error fetching documents: ", error);
    return [];
  }
};

const ItemDetailsModal = ({ itemId, show, onHide, items }) => {
  if (!show || !itemId) return null;

  const item = items.find(i => i.id === itemId);
  if (!item) return null;

  const getStatusBadge = (status) => {
    const badgeClass = status === 'found' ? 'bg-success' : 'bg-warning text-dark';
    return `badge ${badgeClass} fs-6`;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'electronics': '📱',
      'books': '📚',
      'clothing': '👕',
      'accessories': '👜',
      'keys': '🔑',
      'sports': '⚽',
      'other': '📦'
    };
    return icons[category] || '📦';
  };

  // Handle different image sources - Firebase data vs sample data
  const getImageSource = (item) => {
    if (item.images && item.images.length > 0 && item.images[0].base64) {
      return item.images[0].base64;
    }
    return item.image || null;
  };

  const imageSource = getImageSource(item);

  return (
    <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title d-flex align-items-center">
              <span className="me-2">{getCategoryIcon(item.category)}</span>
              {item.title}
              <span className={`ms-2 ${getStatusBadge(item.status)}`}>
                {item.status.toUpperCase()}
              </span>
            </h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>

          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                {imageSource ? (
                  <img
                    src={imageSource}
                    alt={item.title}
                    className="img-fluid rounded mb-3"
                    style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center bg-light rounded mb-3"
                    style={{ width: '100%', height: '300px', fontSize: '4rem' }}
                  >
                    {getCategoryIcon(item.category)}
                  </div>
                )}
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <h6 className="text-muted mb-1">Description</h6>
                  <p>{item.description}</p>
                </div>

                <div className="row mb-3">
                  <div className="col-6">
                    <h6 className="text-muted mb-1">Category</h6>
                    <p className="mb-0">
                      <span className="me-2">{getCategoryIcon(item.category)}</span>
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </p>
                  </div>
                  <div className="col-6">
                    <h6 className="text-muted mb-1">Status</h6>
                    <span className={getStatusBadge(item.status)}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-6">
                    <h6 className="text-muted mb-1">Location</h6>
                    <p className="mb-0">
                      <i className="bi bi-geo-alt-fill me-1"></i>
                      {item.location}
                    </p>
                  </div>
                  <div className="col-6">
                    <h6 className="text-muted mb-1">Date</h6>
                    <p className="mb-0">
                      <i className="bi bi-calendar3 me-1"></i>
                      {item.date}
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <h6 className="text-muted mb-1">Reported By</h6>
                  <p className="mb-0">
                    <i className="bi bi-person-fill me-1"></i>
                    {item.reportedBy}
                    {item.role && <span className="text-muted ms-1">({item.role})</span>}
                  </p>
                </div>

                {item.additionalInfo && (
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">Additional Information</h6>
                    <p className="mb-0">{item.additionalInfo}</p>
                  </div>
                )}

                {item.contactInfo && (
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">Contact Information</h6>
                    <p className="mb-0">
                      <i className="bi bi-envelope me-1"></i>
                      {item.contactInfo}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <div className="d-flex justify-content-between w-100">
              <div>
                <small className="text-muted">Item ID: #{item.id}</small>
              </div>
              <div>
                <button type="button" className="btn btn-outline-secondary me-2" onClick={onHide}>
                  Close
                </button>
                <button type="button" className="btn btn-primary me-2">
                  <i className="bi bi-envelope me-1"></i>
                  Contact Reporter
                </button>
                {item.status === 'found' ? (
                  <Link to={`/claim/${item.id}`}>
                    <button type="button" className="btn btn-success">
                      <i className="bi bi-check-circle me-1"></i>
                      Claim Item
                    </button>
                  </Link>
                ) : (
                  <Link to={'/add-item'}>
                    <button type="button" className="btn btn-info">
                      <i className="bi bi-eye me-1"></i>
                      I Found This
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ItemCard = ({ item, onDetailsClick }) => {
  const [imageError, setImageError] = useState(false);
  console.log(item);

  const handleImageError = () => {
    setImageError(true);
  };

  const getStatusBadge = (status) => {
    const badgeClass = status === 'found' ? 'bg-success' : 'bg-warning text-dark';
    return `badge ${badgeClass}`;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'electronics': '📱',
      'books': '📚',
      'clothing': '👕',
      'accessories': '👜',
      'keys': '🔑',
      'sports': '⚽',
      'other': '📦'
    };
    return icons[category] || '📦';
  };

  // Handle different image sources - Firebase data vs sample data
  const getImageSource = (item) => {
    if (item.images && item.images.length > 0 && item.images[0].base64) {
      return item.images[0].base64;
    }
    return item.image || null;
  };

  const imageSource = getImageSource(item);

  return (
    <div className="card h-100 shadow-sm">
      <div className="position-relative">
        {imageSource && !imageError ? (
          <img
            src={imageSource}
            alt={item.title}
            className="card-img-top"
            style={{ height: '200px', objectFit: 'cover' }}
            onError={handleImageError}
          />
        ) : (
          <div
            className="card-img-top d-flex align-items-center justify-content-center bg-light"
            style={{ height: '200px', fontSize: '4rem' }}
          >
            {getCategoryIcon(item.category)}
          </div>
        )}
        <span className={`position-absolute top-0 end-0 m-2 ${getStatusBadge(item.status)}`}>
          {item.status.toUpperCase()}
        </span>
      </div>

      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-truncate">{item.title}</h5>
        <p className="card-text text-muted small mb-2">
          <i className="bi bi-tag-fill me-1"></i>
          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
        </p>
        <p className="card-text flex-grow-1">{item.description}</p>

        <div className="mt-auto">
          <div className="row g-2 mb-2">
            <div className="col-6">
              <small className="text-muted">
                <i className="bi bi-geo-alt-fill me-1"></i>
                {item.location}
              </small>
            </div>
            <div className="col-6">
              <small className="text-muted">
                <i className="bi bi-calendar3 me-1"></i>
                {item.date}
              </small>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              By: <span className="fw-semibold">{item.reportedBy}</span>
            </small>
            <div>
              <button className="btn btn-outline-primary btn-sm me-2">
                <i className="bi bi-envelope"></i>
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onDetailsClick(item.id)}
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LostFoundPortal = () => {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: ''
  });

  const handleDetailsClick = (itemId) => {
    setSelectedItemId(itemId);
    setShowModal(true);
    console.log('Opening modal for item:', itemId);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItemId(null);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      category: 'all',
      dateFrom: '',
      dateTo: ''
    });
  };

  const applyFilters = (items) => {
    return items.filter(item => {
      if (filters.status !== 'all' && item.status !== filters.status) {
        return false;
      }
      if (filters.category !== 'all' && item.category !== filters.category) {
        return false;
      }
      if (filters.dateFrom || filters.dateTo) {
        const itemDate = new Date(item.date);

        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          if (itemDate < fromDate) return false;
        }

        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          if (itemDate > toDate) return false;
        }
      }

      return true;
    });
  };

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const items = await fetchAllItems();
        console.log('Loaded items:', items);
        setAllItems(items);
      } catch (err) {
        console.error('Error loading items:', err);
        setError('Failed to load items. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, []);

  const filteredItems = applyFilters(allItems);
  const categories = ['electronics', 'books', 'clothing', 'accessories', 'keys', 'sports', 'other'];

  // Loading Component
  const LoadingSpinner = () => (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="text-muted">Loading items...</h5>
        <p className="text-muted mb-0">Please wait while we fetch the latest lost and found items.</p>
      </div>
    </div>
  );

  // Error Component
  const ErrorMessage = () => (
    <div className="row">
      <div className="col-12">
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>
            <strong>Error!</strong> {error}
            <button 
              className="btn btn-outline-danger btn-sm ms-3"
              onClick={() => window.location.reload()}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Retry
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid py-4">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">🔍 Lost & Found Portal</h2>
              <p className="text-muted mb-0">Help reunite students and teachers with their belongings</p>
            </div>
            <div>
              <Link to={'/add-item'}>
                <button className="btn btn-success me-2">
                  <i className="bi bi-plus-circle me-1"></i>
                  Report Item
                </button>
              </Link>
              <button
                className="btn btn-outline-secondary"
                onClick={() => setShowFilters(!showFilters)}
                disabled={loading}
              >
                <i className="bi bi-funnel me-1"></i>
                Filter ({loading ? '...' : filteredItems.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Show error if there's an error */}
      {error && <ErrorMessage />}

      {/* Show loading or content */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Filters Section */}
          {showFilters && (
            <div className="row mb-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">
                      <i className="bi bi-funnel-fill me-2"></i>
                      Filter Items
                    </h6>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={clearFilters}
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-3">
                        <label className="form-label fw-semibold">Status</label>
                        <select
                          className="form-select"
                          value={filters.status}
                          onChange={(e) => handleFilterChange('status', e.target.value)}
                        >
                          <option value="all">All Items</option>
                          <option value="lost">Lost Items</option>
                          <option value="found">Found Items</option>
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label fw-semibold">Category</label>
                        <select
                          className="form-select"
                          value={filters.category}
                          onChange={(e) => handleFilterChange('category', e.target.value)}
                        >
                          <option value="all">All Categories</option>
                          {categories.map(category => (
                            <option key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label fw-semibold">Date From</label>
                        <input
                          type="date"
                          className="form-control"
                          value={filters.dateFrom}
                          onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label fw-semibold">Date To</label>
                        <input
                          type="date"
                          className="form-control"
                          value={filters.dateTo}
                          onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                        />
                      </div>
                    </div>
                    {(filters.status !== 'all' || filters.category !== 'all' || filters.dateFrom || filters.dateTo) && (
                      <div className="mt-3">
                        <div className="d-flex flex-wrap gap-2">
                          <small className="text-muted me-2">Active filters:</small>
                          {filters.status !== 'all' && (
                            <span className="badge bg-primary">
                              Status: {filters.status}
                              <button
                                className="btn-close btn-close-white ms-1"
                                style={{ fontSize: '0.6em' }}
                                onClick={() => handleFilterChange('status', 'all')}
                              ></button>
                            </span>
                          )}
                          {filters.category !== 'all' && (
                            <span className="badge bg-info">
                              Category: {filters.category}
                              <button
                                className="btn-close btn-close-white ms-1"
                                style={{ fontSize: '0.6em' }}
                                onClick={() => handleFilterChange('category', 'all')}
                              ></button>
                            </span>
                          )}
                          {filters.dateFrom && (
                            <span className="badge bg-warning text-dark">
                              From: {filters.dateFrom}
                              <button
                                className="btn-close ms-1"
                                style={{ fontSize: '0.6em' }}
                                onClick={() => handleFilterChange('dateFrom', '')}
                              ></button>
                            </span>
                          )}
                          {filters.dateTo && (
                            <span className="badge bg-warning text-dark">
                              To: {filters.dateTo}
                              <button
                                className="btn-close ms-1"
                                style={{ fontSize: '0.6em' }}
                                onClick={() => handleFilterChange('dateTo', '')}
                              ></button>
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Statistics Cards */}
          {true?<div className="row mb-4">
            <div className="col-md-4">
              <div className="card bg-primary text-white">
                <div className="card-body text-center">
                  <h3 className="mb-1">{filteredItems.length}</h3>
                  <small>Filtered Results</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-success text-white">
                <div className="card-body text-center">
                  <h3 className="mb-1">{filteredItems.filter(item => item.status === 'found').length}</h3>
                  <small>Found Items</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-warning text-dark">
                <div className="card-body text-center">
                  <h3 className="mb-1">{filteredItems.filter(item => item.status === 'lost').length}</h3>
                  <small>Lost Items</small>
                </div>
              </div>
            </div>
          </div>:null}

          {/* No Items Found */}
          {filteredItems.length === 0 && allItems.length > 0 && (
            <div className="row mb-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-body text-center py-5">
                    <i className="bi bi-search display-1 text-muted mb-3"></i>
                    <h4 className="text-muted">No items found</h4>
                    <p className="text-muted mb-3">Try adjusting your filters or check back later for new items.</p>
                    <button
                      className="btn btn-outline-primary"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State - No Items at All */}
          {allItems.length === 0 && !loading && !error && (
            <div className="row mb-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-body text-center py-5">
                    <i className="bi bi-inbox display-1 text-muted mb-3"></i>
                    <h4 className="text-muted">No items reported yet</h4>
                    <p className="text-muted mb-3">Be the first to report a lost or found item!</p>
                    <Link to={'/add-item'}>
                      <button className="btn btn-success">
                        <i className="bi bi-plus-circle me-1"></i>
                        Report Your First Item
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Items Grid */}
          {filteredItems.length > 0 && (
            <div className="row g-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="col-lg-4 col-md-6">
                  <ItemCard item={item} onDetailsClick={handleDetailsClick} />
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {filteredItems.length > 0 && (
            <div className="row mt-4">
              <div className="col-12 text-center">
                <button className="btn btn-outline-primary">
                  <i className="bi bi-arrow-down-circle me-1"></i>
                  Load More Items
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <ItemDetailsModal
        itemId={selectedItemId}
        show={showModal}
        onHide={handleCloseModal}
        items={allItems}
      />
    </div>
  );
};

export default LostFoundPortal;