import { styled } from 'styled-components';
import { useState, useRef, useEffect } from 'react'; // Added useRef and useEffect
import Modal from 'components/Modal';
import { Button } from 'components/Button';
import {
  ButtonColors,
  TT_MUSIC_CMP_URL,
  TT_BC_CMP_URL
} from 'constants';
import { FiPlay, FiChevronDown } from 'react-icons/fi'; // Added FiChevronDown
import Switch from './PostSettings/Switch';

// Define colors for the toggle switches
const TOGGLE_ACTIVE_COLOR = ButtonColors.POSITIVE;
const TOGGLE_INACTIVE_COLOR = ButtonColors.NEGATIVE;

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
    case undefined:
      return '-';
    default:
      return level; // Fallback to display actual value if unknown
  }
};

// Basic styling for components
const Content = styled.div`
  background: white;
  width: 800px;
  max-width: 90vw;
  padding: 25px 25px;
  border-radius: 12px;
  margin: 0 18px;
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: auto auto auto;
  grid-template-areas:
    "leftCol rightCol"
    "compliance compliance"
    "buttons buttons";
  gap: 24px; // Keep existing gap
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  grid-area: leftCol;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  grid-area: rightCol;
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
  grid-area: compliance; /* Added grid-area */
  text-align: center;

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
  grid-area: buttons; /* Added grid-area */
`;

// Custom styled components for Material Design inputs
const CustomSelectWrapper = styled.div`
  position: relative;
  width: 200px; /* Or adjust as needed */
  font-family: 'Roboto', sans-serif; /* Assuming Material Design font */
`;

const CustomSelectDisplay = styled.div`
  padding: 8px 12px;
  border: none;
  border-bottom: 1px solid #ccc; /* Material-like bottom border */
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
  font-size: 16px;

  &:focus,
  &:focus-within {
    outline: none;
    border-bottom: 2px solid #2196f3; /* Material blue focus */
  }
`;

const CustomSelectDropdown = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Material shadow */
`;

const CustomSelectOption = styled.li`
  padding: 8px 12px;
  cursor: pointer;
  &:hover {
    background-color: #eee;
  }
  &.selected {
    background-color: #e0e0e0; /* Slightly different for selected */
  }
`;

const StyledMaterialInput = styled.input`
  width: 200px; /* Or adjust */
  padding: 8px 0; /* Padding for text, no side padding for underline effect */
  padding-right: 3px;
  border: none;
  border-bottom: 1px solid #ccc;
  font-size: 16px;
  background-color: transparent;
  font-family: 'Roboto', sans-serif;
  text-align: right;


  &:focus {
    outline: none;
    border-bottom: 2px solid #2196f3; /* Material blue focus */
  }
  &::placeholder {
    color: #aaa;
  }
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
  const [privacyLevel, setPrivacyLevel] = useState(undefined);
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

  // Ref for tracking brand content toggle and privacy level changes
  const brandContentToggleRef = useRef(null);
  const privacyLevelRef = useRef(null);

  // State for custom select dropdown
  const [isPrivacyDropdownOpen, setIsPrivacyDropdownOpen] = useState(false);
  const privacySelectRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (privacySelectRef.current && !privacySelectRef.current.contains(event.target)) {
        setIsPrivacyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [privacySelectRef]);

  useEffect(() => {
    try {
      if (brandContentEnabled && brandContentToggleRef.current == false) {
        // brand content toggle was just enabled
        if (privacyLevel === 'SELF_ONLY') {
          // privacy level is SELF_ONLY, set to PUBLIC_TO_EVERYONE
          if (creatorInfo.type === 'PUBLIC') {
            // for public account, set privacy level to public to all
            setPrivacyLevel('PUBLIC_TO_EVERYONE');
          } else {
            // for private account, set privacy level to mutual follow friends
            setPrivacyLevel('FOLLOWER_OF_CREATOR');
          }
        }
      } else if (privacyLevel !== privacyLevelRef.current && privacyLevel === 'SELF_ONLY') {
        // privacy level was just changed to private, check brand content toggle
        if (brandContentEnabled) {
          // for private content, the brand content toggle should be disabled
          setBrandContentEnabled(false);
        }
      }

    } finally {
      brandContentToggleRef.current = brandContentEnabled;
      privacyLevelRef.current = privacyLevel;
    }
  }, [privacyLevel, brandContentEnabled])


  // Determine if video duration exceeds maximum
  const durationExceeded = asset?.duration && creatorInfo?.max_video_post_duration_sec &&
                          asset.duration > creatorInfo.max_video_post_duration_sec;

  const sendButtonDisabled = durationExceeded || !privacyLevel;

  // Generate compliance text based on brand settings
  const getComplianceText = () => {
    const musicLinkPart = 
      <a href={TT_MUSIC_CMP_URL} target="_blank" rel="noopener noreferrer">
        Music Usage Confirmation
      </a>
    
    const brandedContentLinkPart =
      <a href={TT_BC_CMP_URL} target="_blank" rel="noopener noreferrer">
        and Branded Content Policy
      </a>

    const links = (
      <>
        {musicLinkPart}
        {brandedContentEnabled && (<> and {brandedContentLinkPart}</>)}
      </>
    );

    return <>By posting, you agree to TikTok's {links}.</>;
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
              {/* Custom Select for Privacy Level */}
              <CustomSelectWrapper ref={privacySelectRef}>
                <CustomSelectDisplay onClick={() => setIsPrivacyDropdownOpen(!isPrivacyDropdownOpen)}>
                  {parsePrivacyLevel(privacyLevel)}
                  <FiChevronDown />
                </CustomSelectDisplay>
                {isPrivacyDropdownOpen && (
                  <CustomSelectDropdown>
                    {creatorInfo.privacy_level_options.map(option => (
                      <CustomSelectOption
                        key={option}
                        className={privacyLevel === option ? 'selected' : ''}
                        onClick={() => {
                          setPrivacyLevel(option);
                          setIsPrivacyDropdownOpen(false);
                        }}
                      >
                        {parsePrivacyLevel(option)}
                      </CustomSelectOption>
                    ))}
                  </CustomSelectDropdown>
                )}
              </CustomSelectWrapper>
            </SettingRow>

            <SettingRow>
              <SettingLabel>Disable Comments</SettingLabel>
              <Switch
                toggled={commentDisabled}
                onChange={setCommentDisabled}
                activeColor={TOGGLE_ACTIVE_COLOR}
                inactiveColor={TOGGLE_INACTIVE_COLOR}
              />
            </SettingRow>

            <SettingRow>
              <SettingLabel>Disable Duets</SettingLabel>
              <Switch
                toggled={duetDisabled}
                onChange={setDuetDisabled}
                activeColor={TOGGLE_ACTIVE_COLOR}
                inactiveColor={TOGGLE_INACTIVE_COLOR}
              />
            </SettingRow>

            <SettingRow>
              <SettingLabel>Disable Stitch</SettingLabel>
              <Switch
                toggled={stitchDisabled}
                onChange={setStitchDisabled}
                activeColor={TOGGLE_ACTIVE_COLOR}
                inactiveColor={TOGGLE_INACTIVE_COLOR}
              />
            </SettingRow>

            <SettingRow>
              <SettingLabel>Video Cover Timestamp (ms)</SettingLabel>
              {/* Custom Input for Video Cover Timestamp */}
              <StyledMaterialInput
                type="text" // Use text for better styling control
                value={videoCoverTimestampMs}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow empty string temporarily for user input, parse to number on blur or confirm
                  // For simplicity here, we'll parse on change and handle non-numeric input
                  const numValue = parseInt(value, 10);
                  if (!isNaN(numValue) || value === '') {
                    setVideoCoverTimestampMs(value === '' ? 0 : numValue);
                  }
                }}
                placeholder="0"
              />
            </SettingRow>

            <SettingRow>
              <SettingLabel>Brand Content</SettingLabel>
              <Switch
                toggled={brandContentEnabled}
                onChange={(value) => {
                  setBrandContentEnabled(value);
                  if (!value) {
                    setYourBrandEnabled(false);
                    setBrandedContentEnabled(false);
                  }
                }}
                activeColor={TOGGLE_ACTIVE_COLOR}
                inactiveColor={TOGGLE_INACTIVE_COLOR}
              />
            </SettingRow>

            {brandContentEnabled && (
              <>
                <NestedSettingRow>
                  <SettingLabel>Your Brand</SettingLabel>
                  <Switch
                    toggled={yourBrandEnabled}
                    onChange={setYourBrandEnabled}
                    activeColor={TOGGLE_ACTIVE_COLOR}
                    inactiveColor={TOGGLE_INACTIVE_COLOR}
                  />
                </NestedSettingRow>

                <NestedSettingRow>
                  <SettingLabel>Branded Content</SettingLabel>
                  <Switch
                    toggled={brandedContentEnabled}
                    onChange={setBrandedContentEnabled}
                    activeColor={TOGGLE_ACTIVE_COLOR}
                    inactiveColor={TOGGLE_INACTIVE_COLOR}
                  />
                </NestedSettingRow>
              </>
            )}

            <SettingRow>
              <SettingLabel>AI-Generated Content</SettingLabel>
              <Switch
                toggled={isAigc}
                onChange={setIsAigc}
                activeColor={TOGGLE_ACTIVE_COLOR}
                inactiveColor={TOGGLE_INACTIVE_COLOR}
              />
            </SettingRow>
          </SettingsSection>
        </RightColumn>

        <ComplianceText>
          {getComplianceText()}
        </ComplianceText>

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
            disabled={sendButtonDisabled}
          >
            Post to TikTok
          </Button>
        </ButtonRow>
      </Content>
    </Modal>
  );
};

export default PrePostingDialog;
