import { useCallback, useState } from 'react';
import ModalWrapper from './modal-wrapper';
import Input from '../Input/Input';
import Btn from '../btn/btn';
import useAuth from '../../hooks/useAuth';
import { updateUser } from '../../services/users-service';

export default function ChangeUsernameModal({
  active,
  onCancel,
  onSubmit: onSubmitProp,
}) {
  const [loading, setLoading] = useState(false);
  const authCtx = useAuth();
  const [input, setInput] = useState(authCtx.username);
  const [error, setError] = useState('');

  const onSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setError('');
      setLoading(true);
      try {
        await updateUser(authCtx.id, input);
        authCtx.changeUserName(input);
        onSubmitProp();
      } catch (error) {
        if (error.response.data.details?.length) {
          setError(error.response.data.details[0]);
        }
      }
      setLoading(false);
    },
    [authCtx, input, onSubmitProp]
  );

  if (!active) {
    return null;
  }

  return (
    <ModalWrapper title="CHANGE USERNAME" onCancel={onCancel}>
      <form className="modal-form" onSubmit={onSubmit}>
        {error && <p className="form-error">{error}</p>}
        <Input
          name="username"
          placeholder="Username"
          className="modal__input-field"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="modal__buttons-container">
          <Btn type="submit" className="btn-green-solid" disabled={loading}>
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
