import React, { useState } from 'react';

const YouTubeLinkInput = () => {
    const [link, setLink] = useState('');

    const handleSubmit = () => {
        if (link.startsWith('https://youtube.com/') || link.startsWith('https://www.youtube.com/')) {
            window.open(link, '_blank'); // Opens the link in a new tab
        } else {
            alert('Please provide a valid YouTube link.');
        }
    }

    return (
        <div>
            <label>
                Paste YouTube Link Here
                <input 
                    type="text" 
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://youtube.com/..."
                />
            </label>
            <button onClick={handleSubmit}>Go</button>
        </div>
    );
}

export default YouTubeLinkInput;