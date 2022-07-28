import { useState } from 'react';
import Btn from '../../components/btn/btn';
import ScreenWrapper from '../../components/wrappers/screen-wrapper/screen-wrapper';
import './profile-page.scss';
import useAuth from '../../hooks/useAuth';
import ChangePasswordModal from '../../components/modals/change-password';
import ChangeUsernameModal from '../../components/modals/change-username';

export default function ProfilePage() {
  const { username } = useAuth();
  const [usernameModal, setUsernameModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);

  return (
    <ScreenWrapper>
      <div className="profile">
        <div className="profile__avatar"></div>
        <p className="profile__username">{username}</p>
        <Btn
          className="btn-blue-outline width-100"
          onClick={() => {
            setUsernameModal(true);
          }}
        >
          Change username
        </Btn>
        <Btn
          className="btn-blue-outline width-100"
          onClick={() => {
            setPasswordModal(true);
          }}
        >
          Change password
        </Btn>
        <ChangePasswordModal
          active={passwordModal}
          onCancel={() => setPasswordModal(false)}
          onSubmit={() => setPasswordModal(false)}
        />
        <ChangeUsernameModal
          active={usernameModal}
          onCancel={() => setUsernameModal(false)}
          onSubmit={() => setUsernameModal(false)}
        />
      </div>
    </ScreenWrapper>
  );
}
