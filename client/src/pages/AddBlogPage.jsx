import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBlog } from '../services/blogService';
import { Loader2, UploadCloud } from 'lucide-react';

const AddBlogPage = () => {
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [category, setCategory] = useState('Technology');
    const [content, setContent] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!thumbnail) {
            setMessage({ type: 'error', text: 'A thumbnail image is required.' });
            return;
        }
        setLoading(true);
        setMessage({ type: '', text: '' });

        const formData = new FormData();
        formData.append('title', title);
        formData.append('subtitle', subtitle);
        formData.append('category', category);
        formData.append('content', content);
        formData.append('thumbnail', thumbnail);

        try {
            await createBlog(formData);
            setMessage({ type: 'success', text: 'Blog post created successfully! Redirecting...' });
            setTimeout(() => navigate('/my-blogs'), 2000);
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Page Header */}
            <div className="border-b border-gray-200 pb-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Create a New Post</h1>
                <p className="mt-1 text-gray-600">Fill out the details below to publish your article.</p>
            </div>

            {/* Main Form Container */}
            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white p-8 border border-gray-200 rounded-lg shadow-sm space-y-6">
                    
                    {/* Success/Error Message */}
                    {message.text && (
                        <div className={`p-4 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}
                    
                    {/* Title & Category Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">Title</label>
                            <input
                                id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">Category</label>
                            <select
                                id="category" value={category} onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                            >
                                <option>Technology</option>
                                <option>Lifestyle</option>
                                <option>Startup</option>
                                <option>Tutorial</option>
                            </select>
                        </div>
                    </div>

                    {/* Subtitle */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="subtitle">Subtitle (Optional)</label>
                        <input
                            id="subtitle" type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                    </div>

                    {/* Thumbnail Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail</label>
                        <div className="mt-2 flex items-center justify-center w-full">
                            <label htmlFor="thumbnail-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Thumbnail Preview" className="h-full w-full object-cover rounded-md"/>
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadCloud className="w-8 h-8 mb-4 text-gray-500" />
                                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 800x400px)</p>
                                    </div>
                                )}
                                <input id="thumbnail-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} required />
                            </label>
                        </div> 
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="content">Content</label>
                        <textarea
                            id="content" rows="12" value={content} onChange={(e) => setContent(e.target.value)} required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit" disabled={loading}
                            className="w-full md:w-auto flex justify-center items-center py-2.5 px-6 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 transition"
                        >
                            {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                            {loading ? 'Publishing...' : 'Publish Post'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddBlogPage;