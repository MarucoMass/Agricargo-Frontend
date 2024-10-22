import { useAuthContext } from "../context/AuthProvider";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../modal/Modal"; 

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { userProfile, userRole } = useAuthContext();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!userProfile.token || !allowedRoles.includes(userRole?.decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"])) {
      setShowModal(true); 
    }
  }, [userProfile, userRole, allowedRoles]);

  const handleLoginRedirect = () => {
    setShowModal(false);
    navigate("/login");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/")
  };

  if (showModal) {
    return (
      <Modal
        show={showModal}
        onClose={handleCloseModal}
        onLogin={handleLoginRedirect}
      />
    );
  }

  return children;
};

export default ProtectedRoute;