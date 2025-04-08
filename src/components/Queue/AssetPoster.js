import React, { useState } from 'react';
import { message } from 'antd';
import { postAsset } from '../api';

const AssetPostForm = ({ onSuccess }) => {
  const [asset, setAsset] = useState(null);
  const [title, setTitle] = useState('');
  const [posting, setPosting] = useState(false);

  const handlePost = async () => {
    if (!asset || !title.trim()) {
      message.error('Please select an asset and provide a title');
      return;
    }

    try {
      setPosting(true);
      await postAsset(asset.id, title);
      message.success('Asset posted successfully');
      onSuccess();
    } catch (error) {
      console.error('Error posting asset:', error);
      message.error('Failed to post asset');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title"
      />
      <button onClick={handlePost} disabled={posting}>
        {posting ? 'Posting...' : 'Post Asset'}
      </button>
    </div>
  );
};

export default AssetPostForm;