import React from 'react';

const LandingPostCard = ({ post, onClick }) => (
    <button
        onClick={onClick}
        className="group text-left w-full h-full flex flex-col"
    >
        <div className="overflow-hidden rounded-lg">
            <img 
                src={post.thumbnail || "https://images.unsplash.com/photo-1517048676732-d65bc937f952"}
                alt={post.title} 
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
            />
        </div>
        <div className="mt-4 flex-grow flex flex-col">
            <p className="text-sm font-semibold text-indigo-600">{post.category}</p>
            <h3 className="mt-1 text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {post.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600 line-clamp-3 flex-grow">
                {post.subtitle || post.content.substring(0, 100) + '...'}
            </p>
        </div>
    </button>
);

export default LandingPostCard;