import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { confirmUser } from '../../services/users-service';
import { SIGN_IN } from '../../constants/constants';

export default function ConfirmAccount() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    (async function () {
      const search = new URLSearchParams(location.search);

      if (!search.get('token')) {
        return navigate('/', { replace: true });
      }

      try {
        await confirmUser(search.get('token'));
      } catch (error) {
        console.error(error);
      }
      navigate(SIGN_IN, { replace: true });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
