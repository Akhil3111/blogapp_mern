import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogById, updateBlog } from '../services/blogService';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS

const EditBlogPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [category, setCategory] = useState('');
    // State for content, now expecting HTML from Quill
    const [content, setContent] = useState(''); 
    const [thumbnail, setThumbnail] = useState(null);
    const [existingThumbnailUrl, setExistingThumbnailUrl] = useState('');
    
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const categories = ['Technology', 'Travel', 'Food', 'Lifestyle', 'Programming', 'Other'];

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                setLoading(true);
                const post = await getBlogById(id);
                
                setTitle(post.title);
                setSubtitle(post.subtitle || '');
                setCategory(post.category);
                setContent(post.content); // Quill will render this HTML
                setExistingThumbnailUrl(post.thumbnail);

            } catch (err) {
                console.error("Error fetching post for edit:", err);
                setError('Failed to load post for editing. Please try again.');
                toast.error('Failed to load post for editing.');
                navigate('/my-blogs');
            } finally {
                setLoading(false);
            }
        };

        fetchPostData();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        // Basic validation for title and content (Quill's content might be <p><br></p>)
        if (!title.trim() || !content.replace(/<[^>]*>/g, '').trim()) { // Remove HTML tags for validation
            setError('Title and Content cannot be empty.');
            toast.error('Title and Content cannot be empty.');
            setSubmitting(false);
            return;
        }
        if (!category) {
            setError('Please select a category.');
            toast.error('Please select a category.');
            setSubmitting(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('subtitle', subtitle);
        formData.append('category', category);
        formData.append('content', content);
        if (thumbnail) {
            formData.append('thumbnail', thumbnail);
        }

        try {
            await updateBlog(id, formData);
            toast.success('Post updated successfully!');
            navigate(`/post/${id}`);
        } catch (err) {
            console.error("Error updating post:", err);
            setError(err.message || 'Failed to update post.');
            toast.error(err.message || 'Failed to update post.');
        } finally {
            setSubmitting(false);
        }
    };

    // Quill modules (toolbar options) - same as AddBlogPage
    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video'
    ];

    if (loading) { /* ... Loading spinner ... */ }
    if (error && !title) { /* ... Error display ... */ }

    return (
        <div className="max-w-3xl mx-auto p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Post</h1>
            <p className="text-gray-600 mb-8">Update the details of your blog post.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                {/* Subtitle */}
                <div>
                    <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">Subtitle (Optional)</label>
                    <input
                        type="text"
                        id="subtitle"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Category */}
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Content - Replaced with ReactQuill */}
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        formats={formats}
                        className="mt-1 block w-full bg-white rounded-md shadow-sm"
                    />
                </div>

                {/* Thumbnail */}
                <div>
                    <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image</label>
                    {existingThumbnailUrl && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-2">Current Thumbnail:</p>
                            <img src={existingThumbnailUrl} alt="Current Thumbnail" className="max-w-[200px] h-auto rounded-md border border-gray-200" />
                        </div>
                    )}
                    <input
                        type="file"
                        id="thumbnail"
                        accept="image/*"
                        onChange={(e) => setThumbnail(e.target.files[0])}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    <p className="mt-2 text-xs text-gray-500">Upload a new image to replace the current thumbnail. Accepted formats: JPG, PNG, WEBP, GIF.</p>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ) : null}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditBlogPage;