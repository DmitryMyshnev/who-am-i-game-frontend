import { useCallback, useState } from 'react';
import ModalWrapper from './modal-wrapper';
import InputPassword from '../Input/InputPassword';
import Btn from '../btn/btn';
import { updatePass } from '../../services/users-service';
import useAuth from '../../hooks/useAuth';

export default function ChangePasswordModal({
  active,
  onCancel,
  onSubmit: onSubmitProp,
}) {
  const [loading, setLoading] = useState(false);
  const authCtx = useAuth();
  const [error, setError] = useState('');
  const [values, setValues] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        await updatePass(
          authCtx.id,
          values.oldPassword,
          values.newPassword,
          values.confirmPassword
        );
        onSubmitProp();
      } catch (error) {
        if (error.response.data.details?.length) {
          setError(error.response.data.details[0]);
        }
      }
      setLoading(false);
    },
    [
      authCtx.id,
      onSubmitProp,
      values.confirmPassword,
      values.newPassword,
      values.oldPassword,
    ]
  );

  const formIsValid =
    values.oldPassword &&
    values.newPassword &&
    values.confirmPassword &&
    values.newPassword === values.confirmPassword;

  if (!active) {
    return null;
  }

  return (
    <ModalWrapper title="CHANGE PASSWORD" onCancel={onCancel}>
      {error && <p className="form-error">{error}</p>}
      <form className="modal-form" onSubmit={onSubmit}>
        <InputPassword
          name="oldPassword"
          placeholder="Old password"
          className="modal__input-field"
          value={values.oldPassword}
          onChange={(e) =>
            setValues({ ...values, oldPassword: e.target.value })
          }
        />
        <InputPassword
          name="newPassword"
          placeholder="New password"
          className="modal__input-field"
          value={values.newPassword}
          onChange={(e) =>
            setValues({ ...values, newPassword: e.target.value })
          }
        />
        <InputPassword
          name="confirmPassword"
          placeholder="Confirm new password"
          className="modal__input-field"
          value={values.confirmPassword}
          onChange={(e) =>
            setValues({ ...values, confirmPassword: e.target.value })
          }
        />
        <div className="modal__buttons-container">
          <Btn
            disabled={loading || !formIsValid}
            type="submit"
            className="btn-green-solid"
          >
            confirm
          </Btn>
          <Btn className="btn-pink-solid" onClick={onCancel}>
            cancel
          </Btn>
        </div>
      </form>
    </ModalWrapper>
  );
}
