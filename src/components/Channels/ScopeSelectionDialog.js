import { useState } from 'react';
import styled from 'styled-components';
import Modal from 'components/Modal';
import { Button, ConfirmButton, CancelButton } from 'components/Button';
import { redirectToTiktokSignin } from 'utils/tiktok';

const DialogContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: white;
  padding: 20px;
  width: 400px;
  max-width: 90vw;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  color: #333;
`;

const Description = styled.p`
  margin: 0;
  color: #666;
  line-height: 1.5;
`;

const OptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
`;

export default function ScopeSelectionDialog({ onClose }) {
  const [includePublishing, setIncludePublishing] = useState(false);

  const handleConfirm = () => {
    redirectToTiktokSignin(includePublishing);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <DialogContent>
        <Title>TikTok Account Permissions</Title>
        <Description>
          Choose what permissions to grant when connecting your TikTok account:
        </Description>

        <OptionContainer>
          <Button
            onClick={() => setIncludePublishing(false)}
            variant={!includePublishing ? 'primary' : 'secondary'}
          >
            View Only - Can view channel stats and video list
          </Button>

          <Button
            onClick={() => setIncludePublishing(true)}
            variant={includePublishing ? 'primary' : 'secondary'}
          >
            View & Post - Can view channel stats and publish videos
          </Button>
        </OptionContainer>

        <ButtonsContainer>
          <CancelButton onClick={onClose}>
            Cancel
          </CancelButton>
          <ConfirmButton onClick={handleConfirm}>
            Connect Account
          </ConfirmButton>
        </ButtonsContainer>
      </DialogContent>
    </Modal>
  );
}
