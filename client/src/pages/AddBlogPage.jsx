import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBlog } from '../services/blogService';
import { Loader2, UploadCloud } from 'lucide-react';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS for styling

const AddBlogPage = () => {
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [category, setCategory] = useState('');
    // State for content, now expecting HTML from Quill
    const [content, setContent] = useState(''); 
    const [thumbnail, setThumbnail] = useState(null);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const categories = ['Technology', 'Travel', 'Food', 'Lifestyle', 'Programming', 'Other'];

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
        if (!thumbnail) {
            setError('Please upload a thumbnail image.');
            toast.error('Please upload a thumbnail image.');
            setSubmitting(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('subtitle', subtitle);
        formData.append('category', category);
        formData.append('content', content); // Content is now HTML
        formData.append('thumbnail', thumbnail);

        try {
            const newPost = await createBlog(formData);
            toast.success('Blog post created successfully!');
            navigate(`/post/${newPost._id}`);
        } catch (err) {
            console.error("Error creating post:", err);
            setError(err.message || 'Failed to create blog post.');
            toast.error(err.message || 'Failed to create blog post.');
        } finally {
            setSubmitting(false);
        }
    };

    // Quill modules (toolbar options)
    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'], // Added image and video support
            ['clean']
        ],
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video'
    ];

    return (
        <div className="max-w-3xl mx-auto p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Blog Post</h1>
            <p className="text-gray-600 mb-8">Fill in the details to create a new blog entry.</p>

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
                        theme="snow" // 'snow' is a clean theme, 'bubble' is another option
                        value={content}
                        onChange={setContent} // Quill handles content as HTML string
                        modules={modules}
                        formats={formats}
                        className="mt-1 block w-full bg-white rounded-md shadow-sm" // Tailwind styling for container
                    />
                </div>

                {/* Thumbnail */}
                <div>
                    <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-indigo-400 transition-colors duration-200">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={(e) => setThumbnail(e.target.files[0])}
                                required={!thumbnail} // Required only if no thumbnail is selected yet
                            />
                            {thumbnail ? (
                                <p className="text-gray-700">File selected: {thumbnail.name}</p>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
                                    <span className="mt-2 text-sm text-gray-600">Upload a thumbnail</span>
                                    <p className="text-xs text-gray-500">JPG, PNG, WEBP, GIF up to 10MB</p>
                                </div>
                            )}
                        </label>
                    </div>
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
                        Publish Post
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddBlogPage;