import React from "react";
import { PhotoIcon, DocumentIcon, LinkIcon } from "@heroicons/react/24/outline";

function PortfolioSection({ portfolio }) {
  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-blue-800/80 backdrop-blur-md rounded-xl shadow-xl border border-blue-500/20 p-6 mb-6 transition-all duration-300 hover:shadow-blue-500/10">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Portfolio
        </span>
      </h2>

      {portfolio && portfolio.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.map((item, index) => (
            <div
              key={index}
              className="border border-blue-500/20 rounded-lg overflow-hidden bg-gray-800/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-500/40"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-700/50">
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : item.type === "document" ? (
                  <div className="flex items-center justify-center h-full">
                    <DocumentIcon className="h-12 w-12 text-blue-400" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <LinkIcon className="h-12 w-12 text-blue-400" />
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-medium text-white">{item.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{item.description}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {item.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-500">{item.date}</span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-300"
                  >
                    View
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <PhotoIcon className="mx-auto h-12 w-12 text-blue-400" />
          <h3 className="mt-2 text-sm font-medium text-white">
            No portfolio items
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            Get started by adding your work and achievements.
          </p>
          <div className="mt-6">
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40">
              Add Portfolio Item
            </button>
          </div>
        </div>
      )}

      {portfolio && portfolio.length > 0 && (
        <div className="mt-6">
          <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40">
            Add Portfolio Item
          </button>
        </div>
      )}
    </div>
  );
}

export default PortfolioSection;
