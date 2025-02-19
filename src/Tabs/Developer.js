import React, { useRef, useState } from "react";
import styled from 'styled-components';

import { downloadChannels, uploadChannels } from "services/backend";
import { saveBlobToFile } from "utils/file";

const ChannelImportExport = () => {
    const fileInputRef = useRef(null);
    const [uploadStatus, setUploadStatus] = useState(null);

  // Function to download the CSV file
    const handleDownload = async () => {
        try {
            const blob = await downloadChannels();
            saveBlobToFile(blob, "channels.csv");
        } catch (error) {
            console.error("Error downloading CSV:", error);
        }
    };

    const handleUpload = async () => {
        try {
            if (!fileInputRef.current.files.length) {
                alert("Please select a file to upload");
                return;
            }

            const file = fileInputRef.current.files[0];
            const data = uploadChannels(file)

            setUploadStatus({ success: true, message: data.message });
        } catch (error) {
        setUploadStatus({ success: false, message: error.message });
        }
    };

    return (
        <div>
            <h2>Channel Table Import/Export</h2>
            <div>
                <h3>Download Files</h3>
                <button onClick={handleDownload}>Download CSV</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100px' }}>
                <h3>Upload Files</h3>
                <input type="file" accept=".csv" ref={fileInputRef} />
                <button onClick={handleUpload}>Upload CSV</button>
            </div>
            {uploadStatus && (
                <p style={{ color: uploadStatus.success ? "green" : "red" }}>
                {uploadStatus.message}
                </p>
            )}
        </div>
    );
};

const Container = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;

    margin-left: 16px;
    margin-right: 16px;
`;

export default function DeveloperView() {
    return (
        <Container>
            <h1>Developer Tools</h1>
            <ChannelImportExport />
        </Container>
    );
}

