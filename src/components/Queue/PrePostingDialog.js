import { styled } from 'styled-components';
import { useState, useEffect } from 'react';
import Modal from 'components/Modal';
import { Button } from 'components/Button';
import { ButtonColors } from 'constants';

// Helper function to format seconds into MM:SS or HH:MM:SS format
const formatTime = (seconds) => {
  if (!seconds && seconds !== 0) return 'Unknown';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Basic styling for components
const Content = styled.div`
  background: white;
  min-width: 450px;
  max-width: 550px;
  padding: 20px 40px;
  border-radius: 12px;
  margin: 0 18px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Avatar = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin-right: 16px;
`;

const CreatorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const CreatorName = styled.h3`
  margin: 0 0 4px 0;
  font-size: 18px;
`;

const CreatorUsername = styled.p`
  margin: 0;
  color: #666;
  font-size: 14px;
`;

const SettingsSection = styled.div`
  margin: 20px 0;
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
`;

const SettingLabel = styled.label`
  font-size: 16px;
  color: #333;
`;

const WarningMessage = styled.div`
  color: #d93025;
  margin: 16px 0;
  padding: 12px;
  background-color: #feeded;
  border-radius: 4px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
`;

const PrePostingDialog = ({ 
  creatorInfo,
  asset,
  channelId,
  onClose,
  onConfirm,
  isLoading,
  error 
}) => {
  // State for configurable settings
  const [privacyLevel, setPrivacyLevel] = useState(
    creatorInfo?.privacy_level_options?.[0] || 'SELF_ONLY'
  );
  const [commentDisabled, setCommentDisabled] = useState(creatorInfo?.comment_disabled || false);
  const [duetDisabled, setDuetDisabled] = useState(creatorInfo?.duet_disabled || false);
  const [stitchDisabled, setStitchDisabled] = useState(creatorInfo?.stitch_disabled || false);
  
  // Additional settings from API documentation
  const [videoCoverTimestampMs, setVideoCoverTimestampMs] = useState(null);
  const [brandContentToggle, setBrandContentToggle] = useState(false);
  const [brandOrganicToggle, setBrandOrganicToggle] = useState(false);
  const [isAigc, setIsAigc] = useState(false);

  // Determine if video duration exceeds maximum
  const durationExceeded = asset?.duration && creatorInfo?.max_video_post_duration_sec && 
                          asset.duration > creatorInfo.max_video_post_duration_sec;
  
  const handleConfirm = () => {
    // Prevent posting if duration exceeds maximum
    if (durationExceeded) {
      alert('Video duration exceeds the maximum allowed for your TikTok account.');
      return;
    }
    
    // Format data to match the API schema
    onConfirm({
      title: asset.title || 'Untitled', // Required field
      privacy_level: privacyLevel,
      disable_comment: commentDisabled,
      disable_duet: duetDisabled,
      disable_stitch: stitchDisabled,
      video_cover_timestamp_ms: videoCoverTimestampMs,
      brand_content_toggle: brandContentToggle,
      brand_organic_toggle: brandOrganicToggle,
      is_aigc: isAigc
    });
  };

  // Render loading state
  if (isLoading) {
    return (
      <Modal onClose={onClose}>
        <Content>
          <h2>Loading Creator Information...</h2>
          {/* Add a loading spinner here */}
        </Content>
      </Modal>
    );
  }

  // Render error state
  if (error) {
    return (
      <Modal onClose={onClose}>
        <Content>
          <h2>Error Loading Creator Information</h2>
          <p>{error}</p>
          <ButtonRow>
            <Button color={ButtonColors.SECONDARY} onClick={onClose}>Close</Button>
          </ButtonRow>
        </Content>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <Content>
        <h2>Confirm TikTok Post</h2>
        
        {/* Creator Info Header */}
        <Header>
          <Avatar src={creatorInfo.creator_avatar_url} alt={creatorInfo.creator_nickname} />
          <CreatorInfo>
            <CreatorName>{creatorInfo.creator_nickname}</CreatorName>
            <CreatorUsername>@{creatorInfo.creator_username}</CreatorUsername>
          </CreatorInfo>
        </Header>
        
        {/* Video Info Section */}
        <SettingsSection>
          <SettingRow>
            <SettingLabel>Video Title</SettingLabel>
            <div>{asset.title || 'Untitled'}</div>
          </SettingRow>
          <SettingRow>
            <SettingLabel>Video Duration</SettingLabel>
            <div>
              {asset.duration ? formatTime(asset.duration) : 'Unknown'} 
              {creatorInfo.max_video_post_duration_sec && 
                ` / Max: ${formatTime(creatorInfo.max_video_post_duration_sec)}`}
            </div>
          </SettingRow>
        </SettingsSection>
        
        {/* Warning for duration */}
        {durationExceeded && (
          <WarningMessage>
            Warning: Your video duration ({formatTime(asset.duration)}) exceeds the maximum allowed for your account ({formatTime(creatorInfo.max_video_post_duration_sec)}).
            The video cannot be posted to TikTok.
          </WarningMessage>
        )}
        
        {/* Configurable Settings */}
        <SettingsSection>
          <h3>Post Settings</h3>
          
          <SettingRow>
            <SettingLabel>Privacy Level</SettingLabel>
            <select 
              value={privacyLevel}
              onChange={(e) => setPrivacyLevel(e.target.value)}
            >
              {creatorInfo.privacy_level_options.map(option => (
                <option key={option} value={option}>
                  {option === 'PUBLIC_TO_EVERYONE' ? 'Public' : 
                   option === 'MUTUAL_FOLLOW_FRIENDS' ? 'Friends Only' : 
                   option === 'FOLLOWER_OF_CREATOR' ? 'Followers' :
                   option === 'SELF_ONLY' ? 'Private' : 
                   option /* Fallback to display actual value if unknown */}
                </option>
              ))}
            </select>
          </SettingRow>
          
          <SettingRow>
            <SettingLabel>Disable Comments</SettingLabel>
            <input 
              type="checkbox" 
              checked={commentDisabled}
              onChange={(e) => setCommentDisabled(e.target.checked)}
            />
          </SettingRow>
          
          <SettingRow>
            <SettingLabel>Disable Duets</SettingLabel>
            <input 
              type="checkbox" 
              checked={duetDisabled}
              onChange={(e) => setDuetDisabled(e.target.checked)}
            />
          </SettingRow>
          
          <SettingRow>
            <SettingLabel>Disable Stitch</SettingLabel>
            <input 
              type="checkbox" 
              checked={stitchDisabled}
              onChange={(e) => setStitchDisabled(e.target.checked)}
            />
          </SettingRow>
          
          <SettingRow>
            <SettingLabel>Video Cover Timestamp (ms)</SettingLabel>
            <input 
              type="number" 
              value={videoCoverTimestampMs || ''}
              onChange={(e) => {
                const value = e.target.value === '' ? null : parseInt(e.target.value, 10);
                setVideoCoverTimestampMs(value);
              }}
              placeholder="0"
            />
          </SettingRow>
          
          <SettingRow>
            <SettingLabel>Brand Content</SettingLabel>
            <input 
              type="checkbox" 
              checked={brandContentToggle}
              onChange={(e) => setBrandContentToggle(e.target.checked)}
            />
          </SettingRow>
          
          <SettingRow>
            <SettingLabel>Brand Organic</SettingLabel>
            <input 
              type="checkbox" 
              checked={brandOrganicToggle}
              onChange={(e) => setBrandOrganicToggle(e.target.checked)}
            />
          </SettingRow>
          
          <SettingRow>
            <SettingLabel>AI-Generated Content</SettingLabel>
            <input 
              type="checkbox" 
              checked={isAigc}
              onChange={(e) => setIsAigc(e.target.checked)}
            />
          </SettingRow>
        </SettingsSection>
        
        {/* Action Buttons */}
        <ButtonRow>
          <Button 
            color={ButtonColors.SECONDARY} 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            color={ButtonColors.PRIMARY} 
            onClick={handleConfirm}
            disabled={durationExceeded}
          >
            Post to TikTok
          </Button>
        </ButtonRow>
      </Content>
    </Modal>
  );
};

export default PrePostingDialog;
