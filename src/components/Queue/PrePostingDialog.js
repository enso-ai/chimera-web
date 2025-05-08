import { styled } from 'styled-components';
import { useState, useEffect } from 'react';
import Modal from 'components/Modal';
import { Button } from 'components/Button';
import { ButtonColors } from 'constants';
import { FiPlay } from 'react-icons/fi';

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

const parsePrivacyLevel = (level) => {
  switch (level) {
    case 'PUBLIC_TO_EVERYONE':
      return 'Public';
    case 'MUTUAL_FOLLOW_FRIENDS':
      return 'Friends Only';
    case 'FOLLOWER_OF_CREATOR':
      return 'Followers';
    case 'SELF_ONLY':
      return 'Private';
    default:
      return level; // Fallback to display actual value if unknown
  }
};

// Basic styling for components
const Content = styled.div`
  background: white;
  width: 800px;
  max-width: 90vw;
  padding: 20px 18px;
  border-radius: 12px;
  margin: 0 18px;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const VideoPreview = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background-color: #000;
  margin-bottom: 16px;
`;

const VideoThumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlayIconOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlayIcon = styled(FiPlay)`
  color: white;
  width: 48px;
  height: 48px;
`;

const VideoInfo = styled.div`
  margin-top: 12px;
`;

const VideoTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #333;
`;

const VideoDuration = styled.div`
  font-size: 14px;
  color: #666;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
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
  margin: 16px 0;
`;

const SettingsTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
`;

const NestedSettingRow = styled(SettingRow)`
  margin-left: 24px;
  padding: 8px 0;
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

const ComplianceText = styled.div`
  font-size: 12px;
  color: #666;
  margin: 16px 0;
  line-height: 1.5;
  
  a {
    color: #2196f3;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
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
  error,
  onPlayVideo,
}) => {
  // State for configurable settings
  const [privacyLevel, setPrivacyLevel] = useState(
    creatorInfo?.privacy_level_options?.[0] || 'SELF_ONLY'
  );
  const [commentDisabled, setCommentDisabled] = useState(creatorInfo?.comment_disabled || false);
  const [duetDisabled, setDuetDisabled] = useState(creatorInfo?.duet_disabled || false);
  const [stitchDisabled, setStitchDisabled] = useState(creatorInfo?.stitch_disabled || false);
  
  // Additional settings from API documentation
  const [videoCoverTimestampMs, setVideoCoverTimestampMs] = useState(0);
  
  // Brand content settings with hierarchy
  const [brandContentEnabled, setBrandContentEnabled] = useState(false);
  const [yourBrandEnabled, setYourBrandEnabled] = useState(false);
  const [brandedContentEnabled, setBrandedContentEnabled] = useState(false);
  const [isAigc, setIsAigc] = useState(false);

  // Determine if video duration exceeds maximum
  const durationExceeded = asset?.duration && creatorInfo?.max_video_post_duration_sec && 
                          asset.duration > creatorInfo.max_video_post_duration_sec;
  
  // Generate compliance text based on brand settings
  const getComplianceText = () => {
    if (brandContentEnabled) {
      if (brandedContentEnabled) {
        return (
          <>
            By posting, you agree to TikTok's <a href="https://www.tiktok.com/legal/page/global/bc-policy/en" target="_blank" rel="noopener noreferrer">Branded Content Policy</a> and <a href="https://www.tiktok.com/legal/page/global/music-usage-confirmation/en" target="_blank" rel="noopener noreferrer">Music Usage Confirmation</a>.
          </>
        );
      } else if (yourBrandEnabled) {
        return (
          <>
            By posting, you agree to TikTok's <a href="https://www.tiktok.com/legal/page/global/music-usage-confirmation/en" target="_blank" rel="noopener noreferrer">Music Usage Confirmation</a>.
          </>
        );
      }
    }
    
    return (
      <>
        By posting, you agree to TikTok's <a href="https://www.tiktok.com/legal/page/global/music-usage-confirmation/en" target="_blank" rel="noopener noreferrer">Music Usage Confirmation</a>.
      </>
    );
  };
  
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
      video_cover_timestamp_ms: videoCoverTimestampMs || 0,
      brand_content_toggle: brandContentEnabled && yourBrandEnabled,
      brand_organic_toggle: brandContentEnabled && brandedContentEnabled,
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
        <LeftColumn>
          {/* Video Preview */}
          <VideoPreview>
            <VideoThumbnail src={asset.thumbnail_url} alt={asset.title || 'Video thumbnail'} />
            <PlayIconOverlay
              onClick={() => onPlayVideo(asset)}
            >
              <PlayIcon />
            </PlayIconOverlay>
          </VideoPreview>
          
          <VideoInfo>
            <VideoTitle>{asset.title || 'Untitled'}</VideoTitle>
            <VideoDuration>
              Duration: {asset.duration ? formatTime(asset.duration) : 'Unknown'} 
              {creatorInfo.max_video_post_duration_sec && 
                ` / Max: ${formatTime(creatorInfo.max_video_post_duration_sec)}`}
            </VideoDuration>
          </VideoInfo>
          
          {/* Warning for duration */}
          {durationExceeded && (
            <WarningMessage>
              Warning: Your video duration exceeds the maximum allowed for your account.
              The video cannot be posted to TikTok.
            </WarningMessage>
          )}
        </LeftColumn>
        
        <RightColumn>
          {/* Creator Info Header */}
          <Header>
            <Avatar src={creatorInfo.creator_avatar_url} alt={creatorInfo.creator_nickname} />
            <CreatorInfo>
              <CreatorName>{creatorInfo.creator_nickname}</CreatorName>
              <CreatorUsername>@{creatorInfo.creator_username}</CreatorUsername>
            </CreatorInfo>
          </Header>
          
          {/* Configurable Settings */}
          <SettingsSection>
            <SettingsTitle>Post Settings</SettingsTitle>
            
            <SettingRow>
              <SettingLabel>Privacy Level</SettingLabel>
              <select 
                value={privacyLevel}
                onChange={(e) => setPrivacyLevel(e.target.value)}
              >
                {creatorInfo.privacy_level_options.map(option => (
                  <option key={option} value={option}>{parsePrivacyLevel(option)}</option>
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
                value={videoCoverTimestampMs}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                  setVideoCoverTimestampMs(value);
                }}
                placeholder="0"
              />
            </SettingRow>
            
            <SettingRow>
              <SettingLabel>Brand Content</SettingLabel>
              <input 
                type="checkbox" 
                checked={brandContentEnabled}
                onChange={(e) => {
                  setBrandContentEnabled(e.target.checked);
                  if (!e.target.checked) {
                    setYourBrandEnabled(false);
                    setBrandedContentEnabled(false);
                  }
                }}
              />
            </SettingRow>
            
            {brandContentEnabled && (
              <>
                <NestedSettingRow>
                  <SettingLabel>Your Brand</SettingLabel>
                  <input 
                    type="checkbox" 
                    checked={yourBrandEnabled}
                    onChange={(e) => setYourBrandEnabled(e.target.checked)}
                  />
                </NestedSettingRow>
                
                <NestedSettingRow>
                  <SettingLabel>Branded Content</SettingLabel>
                  <input 
                    type="checkbox" 
                    checked={brandedContentEnabled}
                    onChange={(e) => setBrandedContentEnabled(e.target.checked)}
                  />
                </NestedSettingRow>
              </>
            )}
            
            <SettingRow>
              <SettingLabel>AI-Generated Content</SettingLabel>
              <input 
                type="checkbox" 
                checked={isAigc}
                onChange={(e) => setIsAigc(e.target.checked)}
              />
            </SettingRow>
          </SettingsSection>
          
          <ComplianceText>
            {getComplianceText()}
          </ComplianceText>
          
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
        </RightColumn>
      </Content>
    </Modal>
  );
};

export default PrePostingDialog;
