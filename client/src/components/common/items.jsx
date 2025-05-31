import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="img-fluid rounded mb-3"
                  style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
                />
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
                  </button></Link>
                ) : (
                  <button type="button" className="btn btn-info">
                    <i className="bi bi-eye me-1"></i>
                    I Found This
                  </button>
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

  return (
    <div className="card h-100 shadow-sm">
      <div className="position-relative">
        {!imageError ? (
          <img 
            src={item.image} 
            className="card-img-top" 
            alt={item.title}
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
  
  const [filters, setFilters] = useState({
    status: 'all', 
    category: 'all', 
    dateFrom: '',
    dateTo: ''
  });

  const handleDetailsClick = (itemId) => {
    setSelectedItemId(itemId);
    setShowModal(true);
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

  const sampleItems = [
    {
      id: 1,
      title: "Black iPhone 13",
      description: "Found in the library on the second floor. Has a cracked screen protector and blue case.",
      category: "electronics",
      status: "found",
      location: "Library - 2nd Floor",
      date: "2024-05-28",
      reportedBy: "Sarah Johnson",
      role: "Student",
      contactInfo: "sarah.j@university.edu",
      additionalInfo: "Phone was found under a desk near the computers section. Battery was at 15%.",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Red Backpack",
      description: "Lost my red backpack with math textbooks inside. Has a small tear on the front pocket.",
      category: "accessories",
      status: "lost",
      location: "Cafeteria",
      date: "2024-05-27",
      reportedBy: "Mike Chen",
      role: "Student",
      contactInfo: "mike.chen@university.edu",
      additionalInfo: "Backpack contains Calculus II textbook, graphing calculator, and notebook with my name.",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Chemistry Textbook",
      description: "Found a chemistry textbook with name 'Alex' written inside. Has yellow highlighter marks.",
      category: "books",
      status: "found",
      location: "Science Lab A",
      date: "2024-05-26",
      reportedBy: "Dr. Rodriguez",
      role: "Professor",
      contactInfo: "rodriguez@university.edu",
      additionalInfo: "Book was left on lab bench after afternoon session. Multiple chapters highlighted.",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      title: "Silver Water Bottle",
      description: "Stainless steel water bottle with university logo sticker. Found near the gym.",
      category: "other",
      status: "found",
      location: "Gymnasium",
      date: "2024-05-25",
      reportedBy: "Coach Williams",
      role: "Staff",
      contactInfo: "coach.williams@university.edu",
      additionalInfo: "Bottle was found in the locker room area. Still had water inside.",
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop"
    },
    {
      id: 5,
      title: "Blue Denim Jacket",
      description: "Lost my favorite denim jacket with patches. Has sentimental value, please help!",
      category: "clothing",
      status: "lost",
      location: "Student Center",
      date: "2024-05-24",
      reportedBy: "Emma Davis",
      role: "Student",
      contactInfo: "emma.davis@university.edu",
      additionalInfo: "Jacket has band patches and a small pin collection. Last seen during lunch break.",
      image: "https://images.unsplash.com/photo-1544966503-7cc4ac882d5d?w=400&h=300&fit=crop"
    },
    {
      id: 6,
      title: "Car Keys with Keychain",
      description: "Found car keys with a small teddy bear keychain. Toyota key fob included.",
      category: "keys",
      status: "found",
      location: "Parking Lot B",
      date: "2024-05-23",
      reportedBy: "Security Guard",
      role: "Security",
      contactInfo: "security@university.edu",
      additionalInfo: "Keys found near the east entrance. Toyota Camry key fob with house keys attached.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"
    }
  ];

  const filteredItems = applyFilters(sampleItems);
  const categories = ['electronics', 'books', 'clothing', 'accessories', 'keys', 'sports', 'other'];

  return (
    <div className="container-fluid py-4">
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
              </button></Link>
              <button 
                className="btn btn-outline-secondary"
                onClick={() => setShowFilters(!showFilters)}
              >
                <i className="bi bi-funnel me-1"></i>
                Filter ({filteredItems.length})
              </button>
            </div>
          </div>
        </div>
      </div>

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
      <div className="row mb-4">
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
      </div>
      {filteredItems.length === 0 && (
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
      <div className="row g-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="col-lg-4 col-md-6">
            <ItemCard item={item} onDetailsClick={handleDetailsClick} />
          </div>
        ))}
      </div>
      <ItemDetailsModal 
        itemId={selectedItemId}
        show={showModal}
        onHide={handleCloseModal}
        items={sampleItems}
      />
      {filteredItems.length > 0 && (
        <div className="row mt-4">
          <div className="col-12 text-center">
            <button className="btn btn-outline-primary">
              Load More Items
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LostFoundPortal;