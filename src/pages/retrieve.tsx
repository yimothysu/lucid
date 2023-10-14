import { useRouter } from 'next/router';
import React, { FormEventHandler, useState } from 'react';

const YouTubeLinkInput = () => {
    const [link, setLink] = useState('');

    const router = useRouter();

    const handleSubmit = (e: any) => {
        if (link.startsWith('https://youtube.com/') || link.startsWith('https://www.youtube.com/')) {
            const suffix = link.split('/').pop();  
            const id = suffix?.split('v=')[1];
            router.push(`/videos/${id}`);
        } else {
            alert('Please provide a valid YouTube link.');
        }
        e.preventDefault();
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Paste YouTube Link Here
                <input 
                    type="text" 
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://youtube.com/..."
                />
            </label>
            <input type="submit" value="Go" />
        </form>
    );
}

export default YouTubeLinkInput;