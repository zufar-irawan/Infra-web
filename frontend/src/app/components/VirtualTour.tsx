'use client';

import { useEffect, useRef, useState } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import { AutorotatePlugin } from '@photo-sphere-viewer/autorotate-plugin';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';

interface Marker {
  id: string;
  position: { yaw: number; pitch: number };
  html: string;
  tooltip: string;
  data?: { targetScene?: string };
}

interface Scene {
  id: string;
  panorama: string;
  name: string;
  description: string;
  markers: Marker[];
}

export default function VirtualTour360() {
  const viewerContainer = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const [currentScene, setCurrentScene] = useState('scene1');
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const isInitialized = useRef(false);

  const scenes: Scene[] = [
    {
      id: 'scene1',
      panorama: '/360/v360-1.jpg',
      name: 'Lapangan',
      description: 'Area lapangan yang luas dan asri',
      markers: [
        {
          id: 'toIndoor',
          position: { yaw: 0, pitch: 0 },
          html: '<div class="custom-marker">→</div>',
          tooltip: 'Ke Indoor',
          data: { targetScene: 'scene2' },
        },
      ],
    },
    {
      id: 'scene2',
      panorama: '/360/v360-2.jpg',
      name: 'Indoor',
      description: 'Ruang indoor yang nyaman',
      markers: [
        {
          id: 'backLapangan',
          position: { yaw: 3.14, pitch: 0 },
          html: '<div class="custom-marker">←</div>',
          tooltip: 'Kembali ke Lapangan',
          data: { targetScene: 'scene1' },
        },
        {
          id: 'toKelas',
          position: { yaw: 1.0, pitch: 0 },
          html: '<div class="custom-marker">→</div>',
          tooltip: 'Ke Kelas',
          data: { targetScene: 'scene3' },
        },
      ],
    },
    {
      id: 'scene3',
      panorama: '/360/v360-3.jpg',
      name: 'Kelas',
      description: 'Ruang kelas dengan fasilitas lengkap',
      markers: [
        {
          id: 'backIndoor',
          position: { yaw: 3.14, pitch: 0 },
          html: '<div class="custom-marker">←</div>',
          tooltip: 'Kembali ke Indoor',
          data: { targetScene: 'scene2' },
        },
      ],
    },
  ];

  useEffect(() => {
    if (!viewerContainer.current) return;
    isInitialized.current = false;

    const scene1 = scenes.find(s => s.id === 'scene1');
    if (!scene1) return;

    const initializeViewer = () => {
      if (isInitialized.current || !viewerContainer.current) return;
      try {
        const viewer = new Viewer({
          container: viewerContainer.current,
          panorama: scene1.panorama,
          loadingImg: '',
          loadingTxt: '',
          plugins: [
            [MarkersPlugin, {}],
            [AutorotatePlugin, {
              autostartDelay: 2000,
              autorotateSpeed: '0.5rpm',
              autorotatePitch: 0,
            }],
          ],
          navbar: ['zoom', 'move', 'fullscreen'],
          defaultZoomLvl: 50,
          minFov: 30,
          maxFov: 90,
        });

        viewerRef.current = viewer;
        isInitialized.current = true;

        const markersPlugin = viewer.getPlugin(MarkersPlugin);
        if (markersPlugin) {
          markersPlugin.addEventListener('select-marker', (e: any) => {
            if (e.marker?.data?.targetScene) {
              changeScene(e.marker.data.targetScene);
            }
          });
        }

        viewer.addEventListener('ready', () => {
          loadScene('scene1');
          setIsLoading(false);
        });
      } catch (error) {
        console.error('Error initializing viewer:', error);
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(initializeViewer, 100);
    return () => {
      clearTimeout(timeoutId);
      if (viewerRef.current) viewerRef.current.destroy();
      viewerRef.current = null;
      isInitialized.current = false;
    };
  }, []);

  const loadScene = (sceneId: string) => {
    const viewer = viewerRef.current;
    const scene = scenes.find(s => s.id === sceneId);
    if (!viewer || !scene) return;
    const markersPlugin = viewer.getPlugin(MarkersPlugin);
    if (markersPlugin) {
      markersPlugin.clearMarkers();
      scene.markers.forEach(m => markersPlugin.addMarker(m));
    }
  };

  const changeScene = async (sceneId: string) => {
    const viewer = viewerRef.current;
    const scene = scenes.find(s => s.id === sceneId);
    if (!viewer || !scene || currentScene === sceneId || isTransitioning) return;
    setIsTransitioning(true);

    const autorotate = viewer.getPlugin(AutorotatePlugin);
    if (autorotate && autoRotate) autorotate.stop();

    try {
      await viewer.setPanorama(scene.panorama);
      setCurrentScene(sceneId);
      loadScene(sceneId);
      if (autorotate && autoRotate) setTimeout(() => autorotate.start(), 1000);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const toggleAutoRotate = () => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const autorotatePlugin = viewer.getPlugin(AutorotatePlugin);
    if (!autorotatePlugin) return;
    if (autoRotate) {
      autorotatePlugin.stop();
      setAutoRotate(false);
    } else {
      autorotatePlugin.start();
      setAutoRotate(true);
    }
  };

  const currentSceneData = scenes.find(s => s.id === currentScene);

  return (
    <>
      <div className="relative w-full h-screen bg-neutral-900 overflow-hidden">
        <div ref={viewerContainer} className="w-full h-full" />

        {/* Custom Loading */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1a0e00] via-[#2b1600] to-[#1a0e00] z-50">
            <div className="relative mb-8">
              <div className="inline-block w-24 h-24 border-4 border-orange-500/20 rounded-full"></div>
              <div className="absolute top-0 left-0 inline-block w-24 h-24 border-4 border-transparent border-t-orange-500 rounded-full animate-spin"></div>
              <div className="absolute top-2 left-2 inline-block w-20 h-20 border-4 border-orange-700/30 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-orange-400 text-xl font-semibold tracking-wide">Memuat Tur Virtual...</p>
            <p className="text-orange-200 text-sm mt-1">Menyiapkan tampilan 360°</p>
          </div>
        )}

        {/* Transition Overlay */}
        {isTransitioning && (
          <div className="absolute inset-0 \z-40 transition-opacity duration-300"></div>
        )}

        {/* Scene Info */}
        {!isLoading && currentSceneData && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
            <div className="bg-gradient-to-r from-[#1a0e00]/90 to-[#2b1600]/80 backdrop-blur-lg text-white px-8 py-4 rounded-2xl shadow-2xl border border-orange-500/30">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-orange-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <div>
                  <div className="font-bold text-base text-orange-400">{currentSceneData.name}</div>
                  <div className="text-xs text-orange-200 mt-0.5">{currentSceneData.description}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Auto Rotate Button */}
        {!isLoading && (
          <div className="absolute top-6 right-6 z-30">
            <button
              onClick={toggleAutoRotate}
              className={`bg-black/70 backdrop-blur-md rounded-full p-3 shadow-lg transition-all duration-300 hover:bg-black/80 ${
                autoRotate ? 'ring-2 ring-orange-500' : ''
              }`}
            >
              <svg
                className={`w-6 h-6 transition-all duration-300 ${
                  autoRotate ? 'text-orange-400 animate-spin-slow' : 'text-white/70'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Navigation Panel */}
        {!isLoading && (
          <div className="absolute top-6 left-6 z-30">
            <div className="bg-gradient-to-br from-[#1a0e00]/90 to-[#2b1600]/80 backdrop-blur-lg rounded-2xl p-5 shadow-2xl border border-orange-500/30">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                </svg>
                <h3 className="text-orange-400 text-xs font-bold uppercase tracking-wider">Navigasi</h3>
              </div>
              <div className="flex flex-col gap-2">
                {scenes.map((scene) => (
                  <button
                    key={scene.id}
                    onClick={() => changeScene(scene.id)}
                    disabled={isTransitioning}
                    className={`relative px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden ${
                      currentScene === scene.id
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105'
                        : 'bg-white/5 text-orange-200 hover:bg-orange-500/10 hover:text-orange-100'
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      {scene.name}
                      {currentScene === scene.id && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .psv-loader, .psv-loader-text {
          display: none !important;
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .custom-marker {
          width: 50px !important;
          height: 50px !important;
          background: linear-gradient(135deg, #FE4D01, #FF7F32) !important;
          border-radius: 50% !important;
          color: white !important;
          font-size: 24px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          box-shadow: 0 10px 25px rgba(254,77,1,0.4) !important;
          transition: all 0.3s ease !important;
          animation: pulse-marker 2s infinite !important;
        }

        @keyframes pulse-marker {
          0%,100% { transform: scale(1); box-shadow: 0 0 15px rgba(254,77,1,0.4); }
          50% { transform: scale(1.1); box-shadow: 0 0 30px rgba(255,127,50,0.6); }
        }

        .info-marker {
          width: 45px !important;
          height: 45px !important;
          background: linear-gradient(135deg, #FFA928, #FE4D01) !important;
          border-radius: 50% !important;
          color: white !important;
          font-size: 22px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: 0 8px 25px rgba(255,150,0,0.5) !important;
          transition: all 0.3s ease !important;
        }

        .info-marker:hover {
          transform: scale(1.2) rotate(360deg) !important;
        }

        .psv-container {
          background: #0a0500 !important;
        }
      `}</style>
    </>
  );
}
