import React, { useState, useEffect, useCallback } from 'react';
import { 
    LogOut, LayoutDashboard, FileText, Plus, User, 
    Loader2, RefreshCw, X, Menu, ThumbsUp, ThumbsDown,
    Image, PenTool, Hash, FileHeart
} from 'lucide-react';

// --- CONFIGURATION ---
const API_BASE_URL = 'http://localhost:5000/api/v1';
const ROOT_URL = 'http://localhost:5000'; // <-- Correct Root URL for static assets

// --- UTILITY & AUTH HOOK ---
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const getStoredUser = () => {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
};

const useAuth = () => {
    const [user, setUser] = useState(getStoredUser());
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    const login = useCallback((token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
    }, []);

    const logout = useCallback(() => {
        const headers = getAuthHeader();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        fetch(`${API_BASE_URL}/auth/logout`, { headers }).catch(console.error);
    }, []);

    return { user, isAuthenticated, isLoading, login, logout };
};


// --- NAV BAR COMPONENT ---
const Navbar = ({ user, isAuthenticated, navigate, logout, toggleSidebar }) => {
    return (
        <header className="bg-white/50 backdrop-blur-md shadow-lg fixed top-0 left-0 right-0 z-20 border-b border-white/20">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
                <div className="flex items-center">
                    {isAuthenticated && (
                        <button onClick={toggleSidebar} className="text-gray-900 mr-3 lg:hidden p-2 rounded-lg hover:bg-gray-100 transition">
                            <Menu className="w-6 h-6" />
                        </button>
                    )}
                    <button 
                        onClick={() => navigate(isAuthenticated ? 'dashboard' : 'dashboard')} 
                        className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 tracking-wider transition transform hover:scale-105"
                    >
                        Quickblog
                    </button>
                </div>
                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <>
                            <div className="flex items-center space-x-3 p-1 rounded-full bg-indigo-50/50 shadow-inner">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                    {user?.username?.[0].toUpperCase() || 'U'}
                                </div>
                                <span className="text-base font-medium text-gray-700 hidden md:inline pr-2">
                                    {user?.username}
                                </span>
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center px-4 py-2 text-sm font-medium rounded-full shadow-lg text-white bg-red-500 hover:bg-red-600 transition transform hover:scale-105"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => navigate('login')} className="text-indigo-600 hover:text-purple-600 transition font-medium">
                                Login
                            </button>
                            <button onClick={() => navigate('register')} className="px-5 py-2 text-sm font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-105">
                                Register
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

// --- SIDEBAR COMPONENT ---
const Sidebar = ({ navigate, activePage, isMobileOpen, toggleSidebar }) => {
    const items = [
        { name: 'Dashboard', page: 'dashboard', icon: LayoutDashboard },
        { name: 'My Blogs', page: 'my-blogs', icon: FileText },
        { name: 'Add Blog', page: 'add-blog', icon: Plus },
    ];

    return (
        <>
            {isMobileOpen && <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-30 lg:hidden" onClick={toggleSidebar}></div>}

            <aside className={`fixed inset-y-0 left-0 transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 w-64 bg-gray-900/90 backdrop-blur-sm text-white shadow-2xl h-full p-6 space-y-4 border-r border-indigo-900 transition-transform duration-300 ease-in-out z-40 pt-20 lg:pt-0`}>
                <button onClick={toggleSidebar} className="absolute top-4 right-4 text-gray-400 hover:text-white lg:hidden p-2 rounded-lg hover:bg-gray-700">
                    <X className="w-6 h-6" />
                </button>
                <nav className="pt-8 lg:pt-0">
                    {items.map((item) => {
                        const isActive = activePage === item.page;
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.page}
                                onClick={() => { navigate(item.page); if (isMobileOpen) toggleSidebar(); }}
                                className={`flex items-center w-full my-2 px-4 py-3 text-base font-medium rounded-xl transition duration-300 ease-in-out transform hover:scale-[1.02] ${
                                    isActive
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-purple-500/30'
                                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                                }`}
                            >
                                <Icon className="w-5 h-5 mr-4" />
                                {item.name}
                            </button>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
};

// --- AUTH FORM COMPONENT ---
const AuthForm = ({ type, auth, navigate }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const isRegister = type === 'register';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const endpoint = isRegister ? '/auth/register' : '/auth/login';
        const body = isRegister ? { username, email, password } : { email, password };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message || 'An error occurred.');
            }
            
            auth.login(data.token, data.user);
            navigate('dashboard');

        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center p-6 min-h-screen bg-gray-900 pt-20 overflow-hidden bg-gradient-to-br from-gray-900 to-indigo-900/50">
            <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\' width=\'32\' height=\'32\' fill=\'none\' stroke=\'%23ffffff\' stroke-width=\'1\'%3E%3Cpath d=\'M0 .5H31.5V32\'/%3E%3C/svg%3E")', backgroundSize: '16px 16px' }}></div>
            <div className="w-full max-w-md bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl z-10 border border-white/30 transform transition duration-500 hover:shadow-indigo-500/40">
                <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    {isRegister ? 'Join Quickblog' : 'Welcome Back'}
                </h2>
                {message && <p className="text-red-500 text-center mb-4">{message}</p>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {isRegister && (
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 shadow-inner focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 shadow-inner focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 shadow-inner focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition transform hover:scale-[1.01]"
                    >
                        {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                        {isRegister ? 'Sign Up' : 'Log In'}
                    </button>
                </form>
                <p className="text-center mt-6 text-sm text-gray-600">
                    {isRegister ? 'Already have an account? ' : "Don't have an account? "}
                    <button onClick={() => navigate(isRegister ? 'login' : 'register')} className="font-semibold text-indigo-600 hover:text-purple-600">
                        {isRegister ? 'Log In' : 'Sign Up'}
                    </button>
                </p>
            </div>
        </div>
    );
};

// --- ADD BLOG PAGE COMPONENT ---
const AddBlogPage = () => {
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [category, setCategory] = useState('General');
    const [content, setContent] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isPublished, setIsPublished] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setThumbnail(null);
            setPreviewUrl(null);
        }
    };

    const resetForm = () => {
        setTitle('');
        setSubtitle('');
        setCategory('General');
        setContent('');
        setThumbnail(null);
        setPreviewUrl(null);
        setIsPublished(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!thumbnail) {
            setMessage({ type: 'error', text: 'Thumbnail image is required.' });
            return;
        }
        setLoading(true);
        setMessage({ type: '', text: '' });

        const formData = new FormData();
        formData.append('title', title);
        formData.append('subtitle', subtitle);
        formData.append('category', category);
        formData.append('content', content);
        formData.append('status', isPublished ? 'Published' : 'Draft');
        formData.append('thumbnail', thumbnail);

        try {
            const response = await fetch(`${API_BASE_URL}/posts`, {
                method: 'POST',
                headers: getAuthHeader(),
                body: formData,
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || data.message || 'Failed to create post.');
            }
            setMessage({ type: 'success', text: `Blog post created successfully! Status: ${data.data.status}` });
            resetForm();
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 p-4 md:p-8 bg-gray-100 pt-24 lg:pt-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-3">Create New Blog Post</h1>
            {message.text && (
                <div className={`p-4 mb-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 md:p-12 rounded-3xl shadow-2xl max-w-5xl mx-auto border border-indigo-100/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b pb-6">
                    <div className="md:col-span-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center mb-2"><PenTool className="w-4 h-4 mr-2" /> Blog Title & Subtitle</label>
                        <input
                            type="text"
                            placeholder="Catchy Blog Title (Required)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 mb-3 border border-gray-300 rounded-xl bg-white text-gray-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Brief Subtitle / Hook"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="md:col-span-1">
                        <label className="text-sm font-semibold text-gray-700 flex items-center mb-2"><Hash className="w-4 h-4 mr-2" /> Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="General">General</option>
                            <option value="Technology">Technology</option>
                            <option value="Lifestyle">Lifestyle</option>
                            <option value="Tutorial">Tutorial</option>
                        </select>
                    </div>
                </div>
                <div className="border p-6 rounded-xl border-dashed border-purple-300 bg-purple-50/30">
                    <label className="text-lg font-semibold text-gray-800 flex items-center mb-4"><Image className="w-5 h-5 mr-2 text-purple-600" /> Upload Thumbnail</label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <div className="w-36 h-36 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-indigo-400 overflow-hidden shadow-inner">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xs text-gray-500 p-2 text-center">Image Preview</span>
                            )}
                        </div>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange}
                            required
                            className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-8 file:rounded-full file:border-0 file:text-base file:font-bold file:bg-gradient-to-r file:from-indigo-600 file:to-purple-600 file:text-white hover:file:from-indigo-700 hover:file:to-purple-700 cursor-pointer transition"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Blog Description (Content)</label>
                    <textarea
                        placeholder="Type your blog content here..."
                        rows="15"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl bg-white text-gray-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                    <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center space-x-2">
                            <input
                                id="publish-now"
                                type="checkbox"
                                checked={isPublished}
                                onChange={(e) => setIsPublished(e.target.checked)}
                                className="h-6 w-6 text-indigo-600 border-gray-300 rounded-full focus:ring-indigo-500 transition"
                            />
                            <label htmlFor="publish-now" className="text-base font-medium text-gray-900">
                                Publish Now
                            </label>
                        </div>
                        <button type="button" onClick={() => alert('AI Generation feature coming soon!')} className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-500 hover:bg-indigo-600 transition">Generate with AI</button>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-4 rounded-xl shadow-xl text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition transform hover:scale-[1.005] shadow-purple-500/50"
                >
                    {loading ? 'Submitting...' : 'Add Blog'}
                </button>
            </form>
        </div>
    );
};

// --- POST ACTIONS COMPONENT (Like/Dislike Fix) ---
const PostActions = ({ post, userId, isAuthenticated, fetchPosts }) => {
    const isLiked = post.likes.includes(userId);
    const isDisliked = post.dislikes.includes(userId);

    const handleAction = async (actionType) => {
        if (!isAuthenticated) return;
        try {
            // CORRECTED: Use PUT method and /posts endpoint
            const response = await fetch(`${API_BASE_URL}/posts/${post._id}/${actionType}`, {
                method: 'PUT',
                headers: getAuthHeader(),
            });
            if (response.ok) {
                fetchPosts(); // Refresh posts to show updated counts
            } else {
                const data = await response.json();
                alert(data.error || 'Could not process action.');
            }
        } catch (error) {
            console.error(`Failed to ${actionType} post:`, error);
        }
    };

    const likeStyles = isLiked 
        ? 'text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-md shadow-green-500/50' 
        : 'text-gray-500 hover:text-green-600 bg-gray-50';
    
    const dislikeStyles = isDisliked 
        ? 'text-white bg-gradient-to-r from-red-500 to-pink-600 shadow-md shadow-red-500/50' 
        : 'text-gray-500 hover:text-red-600 bg-gray-50';

    return (
        <span className="flex items-center space-x-3 text-sm">
            <button
                onClick={() => handleAction('like')}
                disabled={!isAuthenticated}
                className={`flex items-center px-3 py-1.5 rounded-full transition duration-150 transform hover:scale-110 ${likeStyles} disabled:opacity-50`}
            >
                <ThumbsUp className="w-4 h-4 mr-1" /> {/* FIX: Removed extraneous ThumbsUp before the button content */}
                {post.likes.length}
            </button>
            <button
                onClick={() => handleAction('dislike')}
                disabled={!isAuthenticated}
                className={`flex items-center px-3 py-1.5 rounded-full transition duration-150 transform hover:scale-110 ${dislikeStyles} disabled:opacity-50`}
            >
                <ThumbsDown className="w-4 h-4 mr-1" />
                {post.dislikes.length}
            </button>
        </span>
    );
};

// --- Post Card Component (Unchanged) ---
const PostCard = ({ post, isAuthenticated, userId, fetchPosts }) => {
    // FIX: Use ROOT_URL instead of API_BASE_URL for static assets
    const thumbnailUrl = post.thumbnail && post.thumbnail !== 'no-photo.jpg' 
                         ? `${ROOT_URL}${post.thumbnail}`
                         : 'https://placehold.co/400x200/e0e0e0/555?text=No+Image';
    const placeholderImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600' style='background:%23ddd'%3E%3C/svg%3E";

    return (
        <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 ease-in-out flex flex-col hover:shadow-2xl hover:shadow-indigo-300/50 transform hover:scale-[1.02]">
            <div className="h-48 overflow-hidden">
                <img 
                    src={thumbnailUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                    onError={(e) => { e.target.onerror = null; e.target.src=placeholderImg; }}
                />
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center space-x-2 text-xs mb-3">
                    {post.category?.map(cat => (
                        <span 
                            key={cat} 
                            className="px-3 py-1 text-white rounded-full font-bold bg-gradient-to-r from-indigo-500 to-purple-500 shadow-md shadow-purple-300/50"
                        >
                            {cat}
                        </span>
                    ))}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-grow">{post.subtitle || post.content?.substring(0, 100) + '...'}</p>
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="flex items-center space-x-1 text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{post.author?.username || 'Unknown'}</span>
                    </span>
                    <PostActions 
                        post={post} 
                        userId={userId} 
                        isAuthenticated={isAuthenticated} 
                        fetchPosts={fetchPosts}
                    />
                </div>
            </div>
        </div>
    );
};

// --- FETCH CONTENT COMPONENT (Abstracted fetching logic) ---
const FetchContent = ({ endpoint, title, isAuthenticated, user, navigate }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const isPrivate = endpoint === 'posts/my-posts';
            
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, { 
                headers: isPrivate ? getAuthHeader() : {} 
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                if (response.status === 401 && isPrivate) {
                    throw new Error("You must be logged in to view your own posts.");
                }
                throw new Error(data.error || 'Could not fetch data.');
            }
            
            setPosts(data.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [endpoint]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    if (loading) {
        return (
            <div className="flex-1 p-8 flex justify-center items-center">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error) {
        return <div className="flex-1 p-8 text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="flex-1 p-4 md:p-8 bg-gray-100 pt-24 lg:pt-8">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
                <h1 className="text-3xl font-extrabold text-gray-900">{title}</h1>
                <button
                    onClick={fetchPosts}
                    className="px-4 py-2 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 hover:bg-indigo-50 transition flex items-center"
                >
                    <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                </button>
            </div>
            
            {posts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-xl border border-indigo-200/50 max-w-2xl mx-auto mt-10">
                    <FileHeart className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-gray-700 mb-6">Nothing here yet!</p>
                    {isAuthenticated && endpoint === 'posts/my-posts' ? (
                        <button
                            onClick={() => navigate('add-blog')}
                            className="mt-4 px-6 py-3 text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg"
                        >
                            Start Writing Your First Blog
                        </button>
                    ) : (
                        <p className="text-gray-500">Log in to interact with posts.</p>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {posts.map(post => (
                        <PostCard 
                            key={post._id} 
                            post={post} 
                            isAuthenticated={isAuthenticated} 
                            userId={user?._id}
                            fetchPosts={fetchPosts}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};


// --- MAIN APP COMPONENT ---
const App = () => {
    const auth = useAuth();
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const navigate = (page) => {
        setCurrentPage(page);
    };

    // Routing and Auth Redirect Logic
    useEffect(() => {
        if (!auth.isLoading) {
            if (auth.isAuthenticated) {
                if (currentPage === 'login' || currentPage === 'register') {
                    setCurrentPage('dashboard');
                }
            } else {
                if (currentPage !== 'login' && currentPage !== 'register') {
                    setCurrentPage('dashboard');
                }
            }
        }
    }, [auth.isAuthenticated, currentPage, auth.isLoading]);
    
    const toggleSidebar = () => {
        setIsMobileSidebarOpen(prev => !prev);
    };

    const renderPage = () => {
        if (auth.isLoading) return (
            <div className="flex-1 p-8 flex justify-center items-center text-indigo-600">
                <Loader2 className="w-8 h-8 animate-spin" /> Loading Session...
            </div>
        );

        switch (currentPage) {
            case 'login':
                return <AuthForm type="login" auth={auth} navigate={navigate} />;
            case 'register':
                return <AuthForm type="register" auth={auth} navigate={navigate} />;
            case 'dashboard':
                // Public route for all published posts
                return <FetchContent endpoint="posts" title="Public Blog Feed" isAuthenticated={auth.isAuthenticated} user={auth.user} navigate={navigate} />;
            case 'my-blogs':
                // Private route for only the user's posts
                if (!auth.isAuthenticated) return <AuthForm type="login" auth={auth} navigate={navigate} />;
                return <FetchContent endpoint="posts/my-posts" title="My Blogs" isAuthenticated={auth.isAuthenticated} user={auth.user} navigate={navigate} />;
            case 'add-blog':
                if (!auth.isAuthenticated) return <AuthForm type="login" auth={auth} navigate={navigate} />;
                return <AddBlogPage />;
            default:
                return <FetchContent endpoint="posts" title="Public Blog Feed" isAuthenticated={auth.isAuthenticated} user={auth.user} navigate={navigate} />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 antialiased font-sans">
            <Navbar user={auth.user} isAuthenticated={auth.isAuthenticated} navigate={navigate} logout={auth.logout} toggleSidebar={toggleSidebar} />
            <div className="flex flex-1 pt-20">
                {auth.isAuthenticated && (
                    <Sidebar 
                        navigate={navigate} 
                        activePage={currentPage} 
                        isMobileOpen={isMobileSidebarOpen}
                        toggleSidebar={toggleSidebar}
                    />
                )}
                <main className="flex-1 overflow-y-auto">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

export default App;
