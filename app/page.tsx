"use client";

import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    NutrientViewer?: {
      load: (options: { container: HTMLElement; document: string }) => void;
      unload: (container: HTMLElement) => void;
    };
  }
}

export default function App() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (!pdfUrl || !window.NutrientViewer || !containerRef.current) return;

    const container = containerRef.current;
    const { NutrientViewer } = window;

    NutrientViewer.load({
      container,
      document: pdfUrl,
    });

    return () => {
      if (container) {
        NutrientViewer?.unload(container);
      }
    };
  }, [pdfUrl]);

  const handleFile = (file: File) => {
    if (file.type === "application/pdf") {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="flex flex-col h-screen">
      {!pdfUrl ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`flex-1 flex items-center justify-center transition-colors duration-300 ${dragActive ? "bg-blue-50" : "bg-gray-50"
            }`}
        >
          <div className="text-center space-y-4 p-10 border-2 border-dashed border-gray-300 rounded-lg bg-white shadow-sm max-w-md w-full">
            <div className="flex justify-center">
              <svg
                className="w-12 h-12 text-blue-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16v-8m0 0l-3 3m3-3l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-700 font-medium">Drag & drop your PDF here</p>
            <p className="text-gray-500 text-sm">or</p>
            <label className="inline-block cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded shadow-sm transition">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              Browse Files
            </label>
            <p className="text-xs text-gray-400">Max 10MB • PDF format only</p>
          </div>
        </div>
      ) : (
        <>
          <div className="p-4 bg-white border-b flex justify-between items-center shadow-sm">
            <span className="text-sm text-gray-600">Now viewing: your uploaded PDF</span>
            <button
              onClick={() => {
                setPdfUrl(null);
                URL.revokeObjectURL(pdfUrl);
              }}
              className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Upload Another
            </button>
          </div>
          <div ref={containerRef} className="flex-1 overflow-hidden" />
        </>
      )}

      <style global jsx>{`
				* {
					margin: 0;
					padding: 0;
					box-sizing: border-box;
				}
			`}</style>
    </div>
  );
}
