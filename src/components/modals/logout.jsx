import './modal.scss';
import Btn from '../btn/btn';
import ModalWrapper from './modal-wrapper';
import useAuth from '../../hooks/useAuth';
import { logout } from '../../services/users-service';
import { useState } from 'react';

function LogoutModal({ active, onCancel }) {
  const authCtx = useAuth();
  const [loading, setLoading] = useState(false);

  if (!active) {
    return null;
  }

  const submitLogout = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await logout();
      authCtx.logout();
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <ModalWrapper title="LOG OUT" className="leave-modal" onCancel={onCancel}>
      <form className="modal-form leave-modal" onSubmit={submitLogout}>
        <p className="modal__question">Are you sure you want to log out?</p>
        <div className="modal__buttons-container">
          <Btn disabled={loading} type="submit" className="btn-green-solid">
            YES
          </Btn>
          <Btn className="btn-pink-solid" onClick={onCancel}>
            NO
          </Btn>
        </div>
      </form>
    </ModalWrapper>
  );
}

export default LogoutModal;
