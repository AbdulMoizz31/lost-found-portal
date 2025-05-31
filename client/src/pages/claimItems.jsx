import React, { useState } from 'react';
import { CheckCircle, XCircle, User, Calendar, Package, Mail } from 'lucide-react';

const ClaimRequestsPage = () => {
  const [claimRequests, setClaimRequests] = useState([
    {
      id: 1,
      itemName: "Blue Backpack",
      itemId: "LF001",
      claimantName: "Sarah Johnson",
      claimantEmail: "sarah.j@school.edu",
      claimantType: "Student",
      dateSubmitted: "2024-05-28",
      description: "Lost my blue Nike backpack in the library on Monday. Has my laptop and textbooks inside.",
      status: "pending"
    },
    {
      id: 2,
      itemName: "iPhone 13",
      itemId: "LF002",
      claimantName: "Prof. Michael Chen",
      claimantEmail: "m.chen@school.edu",
      claimantType: "Teacher",
      dateSubmitted: "2024-05-27",
      description: "Left my phone in classroom 205 after my morning lecture.",
      status: "pending"
    },
    {
      id: 3,
      itemName: "Red Water Bottle",
      itemId: "LF003",
      claimantName: "Alex Thompson",
      claimantEmail: "alex.t@school.edu",
      claimantType: "Student",
      dateSubmitted: "2024-05-26",
      description: "Red Hydro Flask with stickers. Lost it during PE class.",
      status: "pending"
    },
    {
      id: 4,
      itemName: "Calculator",
      itemId: "LF004",
      claimantName: "Emma Davis",
      claimantEmail: "emma.d@school.edu",
      claimantType: "Student",
      dateSubmitted: "2024-05-25",
      description: "TI-84 calculator, has my name written on the back.",
      status: "approved"
    }
  ]);

  const handleApprove = (id) => {
    setClaimRequests(prev => 
      prev.map(req => 
        req.id === id ? { ...req, status: 'approved' } : req
      )
    );
  };

  const handleReject = (id) => {
    setClaimRequests(prev => 
      prev.map(req => 
        req.id === id ? { ...req, status: 'rejected' } : req
      )
    );
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return <span className="badge bg-success">Approved</span>;
      case 'rejected':
        return <span className="badge bg-danger">Rejected</span>;
      default:
        return <span className="badge bg-warning text-dark">Pending</span>;
    }
  };

  return (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet" />
      
      <div className=" min-vh-100 container">
        <div className="container-fluid py-4">
          <div className="row">
            <div className="col-12">
              <div className="mb-4">
                <h1 className="display-5 fw-bold text-dark mb-2">Claim Requests</h1>
                <p className="text-muted">Review and manage lost & found item claims</p>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {claimRequests.length === 0 ? (
              <div className="col-12">
                <div className="text-center py-5">
                  <Package size={64} className="text-muted mb-3" />
                  <h3 className="text-muted">No Claim Requests</h3>
                  <p className="text-muted">There are no claim requests to review at this time.</p>
                </div>
              </div>
            ) : (
              claimRequests.map(request => (
                <div key={request.id} className="col-lg-4 col-md-6">
                  <div className="card h-100 shadow-sm">
                    <div className="card-header d-flex justify-content-between align-items-center bg-white">
                      <div className="d-flex align-items-center">
                        <Package size={20} className="text-primary me-2" />
                        <h5 className="card-title mb-0">{request.itemName}</h5>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                    
                    <div className="card-body">
                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <User size={16} className="text-muted me-2" />
                          <small className="text-muted">{request.claimantName} ({request.claimantType})</small>
                        </div>
                        
                        <div className="d-flex align-items-center mb-2">
                          <Calendar size={16} className="text-muted me-2" />
                          <small className="text-muted">{request.dateSubmitted}</small>
                        </div>
                        
                        <div className="mb-2">
                          <small className="text-muted"><strong>Item ID:</strong> {request.itemId}</small>
                        </div>
                        
                        <div className="mb-2">
                          <small className="text-muted"><strong>Description:</strong></small>
                          <p className="small text-dark mt-1">{request.description}</p>
                        </div>
                        
                        <div className="d-flex align-items-center">
                          <Mail size={16} className="text-muted me-2" />
                          <small className="text-muted">{request.claimantEmail}</small>
                        </div>
                      </div>
                    </div>
                    
                    {request.status === 'pending' && (
                      <div className="card-footer bg-white">
                        <div className="d-grid gap-2 d-md-flex">
                          <button 
                            className="btn btn-success btn-sm flex-fill d-flex align-items-center justify-content-center"
                            onClick={() => handleApprove(request.id)}
                          >
                            <CheckCircle size={16} className="me-1" />
                            Approve
                          </button>
                          <button 
                            className="btn btn-danger btn-sm flex-fill d-flex align-items-center justify-content-center"
                            onClick={() => handleReject(request.id)}
                          >
                            <XCircle size={16} className="me-1" />
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ClaimRequestsPage;