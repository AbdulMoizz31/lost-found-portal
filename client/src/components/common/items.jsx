import React, { useState } from 'react';

const ItemCard = ({ item }) => {
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
              <button className="btn btn-primary btn-sm">
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LostFoundItems = () => {
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
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"
    }
  ];

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
              <button className="btn btn-success me-2">
                <i className="bi bi-plus-circle me-1"></i>
                Report Item
              </button>
              <button className="btn btn-outline-secondary">
                <i className="bi bi-funnel me-1"></i>
                Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h3 className="mb-1">24</h3>
              <small>Total Items</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h3 className="mb-1">15</h3>
              <small>Found Items</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-dark">
            <div className="card-body text-center">
              <h3 className="mb-1">9</h3>
              <small>Lost Items</small>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-4">
        {sampleItems.map((item) => (
          <div key={item.id} className="col-lg-4 col-md-6">
            <ItemCard item={item} />
          </div>
        ))}
      </div>
      <div className="row mt-4">
        <div className="col-12 text-center">
          <button className="btn btn-outline-primary">
            Load More Items
          </button>
        </div>
      </div>
    </div>
  );
};

export default LostFoundItems;