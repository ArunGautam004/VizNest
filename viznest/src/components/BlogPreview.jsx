import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, ShoppingBag } from 'lucide-react';
import { blogPosts } from '../data/blogData';

const BlogPreview = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 to-rose-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Inspiration Journal</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stories and styling tips to help you create a home you love.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(0, 3).map((post) => (
            <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition">
              <div className="h-64 overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex justify-between items-center">
                  <Link to={`/blog/${post.id}`} className="text-indigo-600 font-medium flex items-center gap-1 hover:gap-2 transition">
                    Read More <ArrowRight size={16} />
                  </Link>
                  {post.relatedProductId && (
                    <Link to={`/product/${post.relatedProductId}`} className="text-rose-500 text-sm flex items-center gap-1">
                      Shop the Look <ShoppingBag size={14} />
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;