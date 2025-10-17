import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogById, updateBlog } from '../services/blogService';
import { Loader2, UploadCloud } from 'lucide-react';

const EditBlogPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [category, setCategory] = useState('Technology');
    const [content, setContent] = useState('');
    const [thumbnail, setThumbnail] = useState(null); // For new file upload
    const [previewUrl, setPreviewUrl] = useState(''); // For existing or new image preview
    
    const [loading, setLoading] = useState(true); // Initial loading of post data
    const [isUpdating, setIsUpdating] = useState(false); // For submission
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                setLoading(true);
                const postData = await getBlogById(id);
                setTitle(postData.title);
                setSubtitle(postData.subtitle || '');
                setCategory(postData.category);
                setContent(postData.content);
                setPreviewUrl(postData.thumbnail); // Set initial preview to existing thumbnail
            } catch (error) {
                setMessage({ type: 'error', text: 'Failed to load post data.' });
            } finally {
                setLoading(false);
            }
        };
        fetchPostData();
    }, [id]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file); // Store the new file object
            setPreviewUrl(URL.createObjectURL(file)); // Update preview to show the new image
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setMessage({ type: '', text: '' });

        const formData = new FormData();
        formData.append('title', title);
        formData.append('subtitle', subtitle);
        formData.append('category', category);
        formData.append('content', content);
        if (thumbnail) {
            // Only append the thumbnail if a new one was selected
            formData.append('thumbnail', thumbnail);
        }

        try {
            await updateBlog(id, formData);
            setMessage({ type: 'success', text: 'Post updated successfully! Redirecting...' });
            setTimeout(() => navigate('/my-blogs'), 2000);
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-10"><Loader2 className="w-12 h-12 animate-spin text-gray-400" /></div>;
    }

    return (
        <div>
            <div className="border-b border-gray-200 pb-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
                <p className="mt-1 text-gray-600">Update the details of your blog post.</p>
            </div>

            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white p-8 border border-gray-200 rounded-lg shadow-sm space-y-6">
                    {/* ... (Form fields are identical to AddBlogPage, but pre-filled) ... */}
                    {/* Title, Category, Subtitle, Thumbnail, Content */}
                    <div className="flex justify-end">
                        <button type="submit" disabled={isUpdating} className="w-full md:w-auto flex justify-center items-center py-2.5 px-6 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-800 focus:outline-none disabled:opacity-50">
                            {isUpdating && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                            {isUpdating ? 'Saving Changes...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBlogPage;