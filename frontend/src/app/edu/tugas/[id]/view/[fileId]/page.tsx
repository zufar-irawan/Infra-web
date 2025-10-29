"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";

export default function FileViewerPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;
  const fileId = params.fileId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<any>(null);

  // Use the Next.js API proxy route instead of direct backend URL
  const fileViewUrl = `/api/tugas/files/${assignmentId}/${fileId}/view`;
  const fileDownloadUrl = `/api/tugas/files/${assignmentId}/${fileId}`;

  useEffect(() => {
    // Fetch assignment details to get file information
    const fetchFileInfo = async () => {
      try {
        const response = await fetch(`/api/tugas/${assignmentId}`);
        if (!response.ok) throw new Error("Failed to load file info");

        const data = await response.json();
        const file = data.files?.find((f: any) => f.id == fileId);

        if (file) {
          setFileInfo(file);
        }
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching file info:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFileInfo();
  }, [assignmentId, fileId]);

  const handleDownload = () => {
    window.open(fileDownloadUrl, "_blank");
  };

  const handleOpenExternal = () => {
    window.open(fileViewUrl, "_blank");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Kembali</span>
              </button>
              {fileInfo && (
                <div className="border-l border-gray-300 dark:border-gray-600 pl-4">
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {fileInfo.name || "Dokumen"}
                  </h1>
                  {fileInfo.mime && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {fileInfo.mime}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenExternal}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <ExternalLink size={16} />
                Buka di Tab Baru
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download size={16} />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Viewer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Memuat dokumen...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={handleBack}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Kembali
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <iframe
              src={fileViewUrl}
              className="w-full h-[calc(100vh-200px)] min-h-[600px]"
              title={fileInfo?.name || "Document Viewer"}
            />
          </div>
        )}
      </div>
    </div>
  );
}
