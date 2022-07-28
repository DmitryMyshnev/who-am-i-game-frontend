import Btn from '../../components/btn/btn';
import GameTitle from '../../components/game-title/game-title';
import ScreenWrapper from '../../components/wrappers/screen-wrapper/screen-wrapper';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useCallback, useEffect, useMemo } from 'react';
import InputPassword from '../../components/Input/InputPassword';
import { sendPass } from '../../services/users-service';
import { SIGN_IN } from '../../constants/constants';

function NewPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = useMemo(
    () => new URLSearchParams(location.search).get('token'),
    [location]
  );

  useEffect(() => {
    if (!token) {
      navigate('/', { replace: true });
    }
  }, [location, navigate, token]);

  const passwordHandler = (e) => {
    setPassword(e.target.value);
  };

  const rePasswordHandler = (e) => {
    setRePassword(e.target.value);
  };

  const formIsValid =
    password.length >= 8 && password.length < 20 && password === rePassword;

  const submitHandler = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        await sendPass(token, password, rePassword);
        navigate(SIGN_IN);
      } catch (error) {
        if (error.response.data.details?.length) {
          setError(error.response.data.details[0]);
        }
      }
      setLoading(false);
    },
    [navigate, password, rePassword, token]
  );

  if (!token) {
    return null;
  }

  return (
    <ScreenWrapper>
      <GameTitle />
      {error && <p className="form-error">{error}</p>}
      <form className="form-wrapper" onSubmit={submitHandler}>
        <InputPassword
          name="password"
          value={password}
          onChange={(e) => passwordHandler(e)}
          placeholder="New password"
        />
        <InputPassword
          name="rePassword"
          value={rePassword}
          onChange={(e) => rePasswordHandler(e)}
          placeholder="Confirm new password"
        />
        <div className="btn-form-wrapper">
          <Btn
            className={'btn-pink-solid'}
            onClick={() => {
              navigate('/');
            }}
          >
            Cancel
          </Btn>
          <Btn disabled={loading || !formIsValid} type="submit">
            confirm
          </Btn>
        </div>
      </form>
    </ScreenWrapper>
  );
}

export default NewPassword;
