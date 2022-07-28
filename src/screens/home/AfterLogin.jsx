import Btn from '../../components/btn/btn';
import { MAIN_LOBBY, PROFILE } from '../../constants/constants';
import { useNavigate } from 'react-router-dom';
import PlayQuickGameButton from './PlayQuickGameButton';
import useAuth from '../../hooks/useAuth';
import { useState } from 'react';
import LogoutModal from '../../components/modals/logout';

function getNameFirstLetters(username) {
  const split = username.split(' ');

  if (split.length < 2) {
    return username[0];
  }

  return `${split[0][0]}${split[1][0]}`;
}

function AfterLogin() {
  const navigate = useNavigate();
  const authCtx = useAuth();
  const [logoutModalActive, setLogoutModalActive] = useState(false);

  return (
    <div className="after-login-wrapper">
      <div className="profile">
        <div className="profile__title">welcome</div>
        <div className="profile__body">
          <div className="profile__avatar">
            {getNameFirstLetters(authCtx.username)}
          </div>
          <div className="profile__name">{authCtx.username}</div>
          <div className="profile__edit-icon"></div>
        </div>
      </div>
      <PlayQuickGameButton />
      <Btn
        className={'btn-blue-outline'}
        onClick={() => {
          navigate(MAIN_LOBBY);
        }}
      >
        Lobbies
      </Btn>
      <Btn
        className={'btn-blue-outline'}
        onClick={() => {
          navigate(PROFILE);
        }}
      >
        profile
      </Btn>
      <Btn
        className={'btn-pink-outline'}
        onClick={() => setLogoutModalActive(true)}
      >
        log out
      </Btn>
      <LogoutModal
        active={logoutModalActive}
        onCancel={() => setLogoutModalActive(false)}
      />
    </div>
  );
}

export default AfterLogin;
