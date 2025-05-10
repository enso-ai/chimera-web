import { useState } from "react";
import styled from "styled-components";
import Modal from "components/Modal";
import { ConfirmButton, CancelButton } from "components/Button";
import Switch from "components/Queue/PostSettings/Switch"; // Updated import
import { redirectToTiktokSignin } from "utils/tiktok";

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

// New styled components for the single row layout
const PermissionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
`;

const PermissionLabel = styled.div`
  font-size: 16px;
  color: #444;
  margin-right: 15px; /* Add some space between label and switch */
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
  border-top: 1px solid #eee; /* Optional: visual separator */
  padding-top: 15px; /* Optional: spacing for separator */
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
        
        {/* Updated UI with Switch */}
        <PermissionRow>
          <PermissionLabel>
            Allow Chimera to publish videos to this TikTok account?
          </PermissionLabel>
          <Switch 
            toggled={includePublishing}
            onChange={setIncludePublishing}
            activeColor="#1DA1F2" // Example active color (Twitter blue)
            inactiveColor="#ccc"    // Example inactive color
          />
        </PermissionRow>
        
        <ButtonsContainer>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <ConfirmButton onClick={handleConfirm}>Connect Account</ConfirmButton>
        </ButtonsContainer>
      </DialogContent>
    </Modal>
  );
}
