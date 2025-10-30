'use client';

import { useEffect, useRef, useState } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import { AutorotatePlugin } from '@photo-sphere-viewer/autorotate-plugin';

// @ts-ignore
import '@photo-sphere-viewer/core/index.css';

// @ts-ignore
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
    const [isMobile, setIsMobile] = useState(false);
    const isInitialized = useRef(false);

    const scenes: Scene[] = [
        {
            id: 'scene1',
            panorama: '/360/v360-1.jpg',
            name: 'Field',
            description: 'Field of Prestasi Prima School',
            markers: [
                {
                    id: 'toCooperative',
                    position: { yaw: 0.43, pitch: -0.01 },
                    html: '<div class="select-none custom-marker">!</div>',
                    tooltip: 'To Cooperative',
                    data: { targetScene: 'scene2' },
                },
                {
                    id: 'toExc',
                    position: { yaw: -0.01, pitch: 0.36 },
                    html: '<div class="select-none custom-marker">!</div>',
                    tooltip: 'To Executive',
                    data: { targetScene: 'scene5' },
                },
            ],
        },
        {
            id: 'scene2',
            panorama: '/360/v360-3.jpg',
            name: 'Cooperative',
            description: 'Cooperative of Prestasi Prima School',
            markers: [
                {
                    id: 'toField',
                    position: { yaw: 0.83, pitch: -0.05 },
                    html: '<div class="select-none custom-marker">←</div>',
                    tooltip: 'To Field',
                    data: { targetScene: 'scene1' },
                },
                {
                    id: 'toCafeteria',
                    position: { yaw: 1.01, pitch: -0.05 },
                    html: '<div class="select-none custom-marker">→</div>',
                    tooltip: 'To Cafeteria',
                    data: { targetScene: 'scene3' },
                },
            ],
        },
        {
            id: 'scene3',
            panorama: '/360/v360-4.jpg',
            name: 'Cafeteria',
            description: 'Cafeteria of Prestasi Prima School',
            markers: [
                {
                    id: 'toCooperative',
                    position: { yaw: -0.77, pitch: -0.07 },
                    html: '<div class="select-none custom-marker">←</div>',
                    tooltip: 'To Cooperative',
                    data: { targetScene: 'scene2' },
                },
            ],
        },
        {
            id: 'scene4',
            panorama: '/360/v360-2.jpg',
            name: 'Corridor',
            description: 'Corridor of Prestasi Prima School',
            markers: [
                {
                    id: 'toField',
                    position: { yaw: 2.83, pitch: -0.3 },
                    html: '<div class="select-none custom-marker">!</div>',
                    tooltip: 'To Field',
                    data: { targetScene: 'scene1' },
                },
                {
                    id: 'toExc',
                    position: { yaw: 4.14, pitch: -0.02 },
                    html: '<div class="select-none custom-marker">!</div>',
                    tooltip: 'To Executive',
                    data: { targetScene: 'scene5' },
                },
            ],
        },
        {
            id: 'scene5',
            panorama: '/360/v360-10.jpg',
            name: 'Executive',
            description: 'Executive of Prestasi Prima School',
            markers: [
                {
                    id: 'toField',
                    position: { yaw: 1.17, pitch: 0 },
                    html: '<div class="select-none custom-marker">!</div>',
                    tooltip: 'To Field',
                    data: { targetScene: 'scene1' },
                },
                {
                    id: 'toExcClass',
                    position: { yaw: 2.65, pitch: -0.1 },
                    html: '<div class="select-none custom-marker">!</div>',
                    tooltip: 'To Executive Class',
                    data: { targetScene: 'scene6' },
                },
                {
                    id: 'toCorridor',
                    position: { yaw: -2.08, pitch: -0.05 },
                    html: '<div class="select-none custom-marker">!</div>',
                    tooltip: 'To Corridor',
                    data: { targetScene: 'scene4' },
                },
            ],
        },
        {
            id: 'scene6',
            panorama: '/360/v360-6.jpg',
            name: 'Executive Class',
            description: 'Executive Classroom of Prestasi Prima School',
            markers: [
                {
                    id: 'toExc',
                    position: { yaw: 1.74, pitch: -0.16 },
                    html: '<div class="select-none custom-marker">!</div>',
                    tooltip: 'To Executive',
                    data: { targetScene: 'scene5' },
                },
            ]
        },
        {
            id: 'scene7',
            panorama: '/360/v360-5.jpg',
            name: 'PPLG Laboratory',
            description: 'Executive Classroom of Prestasi Prima School',
            markers: [
                {
                    id: 'toExc',
                    position: { yaw: 1.74, pitch: -0.16 },
                    html: '<div class="select-none custom-marker">!</div>',
                    tooltip: 'To Executive',
                    data: { targetScene: 'scene5' },
                },
            ]
        },
        {
            id: 'scene8',
            panorama: '/360/v360-7.jpg',
            name: 'BC Laboratory',
            description: 'Executive Classroom of Prestasi Prima School',
            markers: [
                {
                    id: 'toExc',
                    position: { yaw: 1.74, pitch: -0.16 },
                    html: '<div class="select-none custom-marker">!</div>',
                    tooltip: 'To Executive',
                    data: { targetScene: 'scene5' },
                },
            ]
        },
        {
            id: 'scene9',
            panorama: '/360/v360-8.jpg',
            name: 'Regular Class',
            description: 'Regular Classroom of Prestasi Prima School',
            markers: [
                {
                    id: 'toExc',
                    position: { yaw: 1.74, pitch: -0.16 },
                    html: '<div class="select-none custom-marker">!</div>',
                    tooltip: 'To Executive',
                    data: { targetScene: 'scene5' },
                },
            ]
        },
        {
            id: 'scene10',
            panorama: '/360/v360-9.jpg',
            name: 'Pathway',
            description: 'C Pathway of Prestasi Prima School',
            markers: [
                {
                    id: 'toExc',
                    position: { yaw: 1.74, pitch: -0.16 },
                    html: '<div class="select-none custom-marker">!</div>',
                    tooltip: 'To Executive',
                    data: { targetScene: 'scene5' },
                },
            ]
        },
        {
            id: 'scene11',
            panorama: '/360/v360-11.jpg',
            name: 'Library',
            description: 'Library of Prestasi Prima School',
            markers: [
                {
                    id: 'toExc',
                    position: { yaw: 1.74, pitch: -0.16 },
                    html: '<div class="select-none custom-marker">!</div>',
                    tooltip: 'To Executive',
                    data: { targetScene: 'scene5' },
                },
            ],
        },
    ];

    useEffect(() => {
        const updateBreakpoint = () => {
            if (typeof window === 'undefined') return;
            setIsMobile(window.matchMedia('(max-width: 1024px)').matches);
        };
        updateBreakpoint();
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', updateBreakpoint);
        }

        if (!viewerContainer.current) {
            return () => {
                if (typeof window !== 'undefined') {
                    window.removeEventListener('resize', updateBreakpoint);
                }
            };
        }

        isInitialized.current = false;

        const scene1 = scenes.find(s => s.id === 'scene1');
        if (!scene1) {
            return () => {
                if (typeof window !== 'undefined') {
                    window.removeEventListener('resize', updateBreakpoint);
                }
            };
        }

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
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', updateBreakpoint);
            }
        };
    }, []);

    const loadScene = (sceneId: string) => {
        const viewer = viewerRef.current;
        const scene = scenes.find(s => s.id === sceneId);
        if (!viewer || !scene) return;
        const markersPlugin = viewer.getPlugin(MarkersPlugin);
        if (markersPlugin) {
            // @ts-ignore
            markersPlugin.clearMarkers();

            // @ts-ignore
            scene.markers.forEach(m => markersPlugin.addMarker(m));
        }
    };

    const changeScene = async (sceneId: string) => {
        const viewer = viewerRef.current;
        const scene = scenes.find(s => s.id === sceneId);
        if (!viewer || !scene || currentScene === sceneId || isTransitioning) return;
        setIsTransitioning(true);

        const autorotate = viewer.getPlugin(AutorotatePlugin);
        // @ts-ignore
        if (autorotate && autoRotate) autorotate.stop();

        try {
            await viewer.setPanorama(scene.panorama);
            setCurrentScene(sceneId);
            loadScene(sceneId);

            // @ts-ignore
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
            // @ts-ignore
            autorotatePlugin.stop();
            setAutoRotate(false);
        } else {
            // @ts-ignore
            autorotatePlugin.start();
            setAutoRotate(true);
        }
    };

    const currentSceneData = scenes.find(s => s.id === currentScene);

    return (
        <>
            <div
                className={`relative w-full bg-neutral-900 overflow-hidden select-none ${isMobile ? 'h-[calc(100vh-80px)] min-h-[480px]' : 'h-screen'
                    }`}
            >
                <div ref={viewerContainer} className="w-full h-full" />

                {/* Custom Loading */}
                {isLoading && (
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1a0e00] via-[#2b1600] to-[#1a0e00] z-50">
                        <div className="relative mb-8">
                            <div className="inline-block w-24 h-24 border-4 border-orange-500/20 rounded-full"></div>
                            <div
                                className="absolute top-0 left-0 inline-block w-24 h-24 border-4 border-transparent border-t-orange-500 rounded-full animate-spin"></div>
                            <div
                                className="absolute top-2 left-2 inline-block w-20 h-20 border-4 border-orange-700/30 rounded-full"></div>
                            <div
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
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
                    <div
                        className={`absolute ${isMobile ? 'top-4 left-1/2 -translate-x-1/2' : 'top-6 left-1/2 -translate-x-1/2'
                            } z-30 pointer-events-none w-[calc(100%-2rem)] max-w-xl`}
                    >
                        <div
                            className={`bg-gradient-to-r from-[#1a0e00]/90 to-[#2b1600]/80 backdrop-blur-lg text-white ${isMobile ? 'px-4 py-3 rounded-xl' : 'px-8 py-4 rounded-2xl'
                                } shadow-2xl border border-orange-500/30`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                                    <div
                                        className="absolute inset-0 w-3 h-3 bg-orange-500 rounded-full animate-ping opacity-75"></div>
                                </div>
                                <div>
                                    <div className={`font-bold ${isMobile ? 'text-sm' : 'text-base'} text-orange-400`}>
                                        {currentSceneData.name}
                                    </div>
                                    <div className={`text-orange-200 mt-0.5 ${isMobile ? 'text-[11px]' : 'text-xs'}`}>
                                        {currentSceneData.description}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Auto Rotate Button */}
                {!isLoading && (
                    <div
                        className={`absolute z-30 ${isMobile ? 'bottom-4 right-4' : 'top-6 right-6'
                            }`}
                    >
                        <button
                            onClick={toggleAutoRotate}
                            className={`bg-black/70 backdrop-blur-md rounded-full p-3 shadow-lg transition-all duration-300 hover:bg-black/80 ${autoRotate ? 'ring-2 ring-orange-500' : ''
                                }`}
                        >
                            <svg
                                className={`w-6 h-6 transition-all duration-300 ${autoRotate ? 'text-orange-400 animate-spin-slow' : 'text-white/70'
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
                    <div
                        className={`absolute z-30 ${isMobile
                            ? 'left-1/2 -translate-x-1/2 bottom-4 w-[calc(100%-2rem)] max-w-md'
                            : 'top-6 left-6'
                            }`}
                    >
                        <div
                            className={`bg-gradient-to-br from-[#1a0e00]/90 to-[#2b1600]/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-orange-500/30 ${isMobile ? 'p-4' : 'p-5'
                                }`}
                        >
                            <div className={`flex items-center gap-2 ${isMobile ? 'mb-3' : 'mb-4'}`}>
                                <svg className={`text-orange-400 ${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                                <h3 className={`text-orange-400 font-bold uppercase tracking-wider ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                                    Navigasi
                                </h3>
                            </div>
                            {isMobile ? (
                                <div className="relative">
                                    <select
                                        value={currentScene}
                                        onChange={(event) => changeScene(event.target.value)}
                                        disabled={isTransitioning}
                                        className="w-full appearance-none bg-white/10 text-orange-100 border border-orange-500/20 rounded-xl px-4 py-3 text-sm font-medium backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        {scenes.map((scene) => (
                                            <option key={scene.id} value={scene.id} className="bg-[#1a0e00] text-orange-100">
                                                {scene.name}
                                            </option>
                                        ))}
                                    </select>
                                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-orange-300">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M5.23 7.21a.75.75 0 011.06.02L10 10.648l3.71-3.417a.75.75 0 111.04 1.08l-4.24 3.904a.75.75 0 01-1.04 0L5.21 8.29a.75.75 0 01.02-1.08z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </span>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {scenes.map((scene) => (
                                        <button
                                            key={scene.id}
                                            onClick={() => changeScene(scene.id)}
                                            disabled={isTransitioning}
                                            className={`relative rounded-xl font-semibold transition-all duration-300 overflow-hidden cursor-pointer ${currentScene === scene.id
                                                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                                                : 'bg-white/5 text-orange-200 hover:bg-orange-500/20 hover:text-orange-100'
                                                } px-5 py-3 text-sm w-50`}
                                        >
                                            <span className="flex items-center justify-between gap-2">
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
                            )}
                        </div>
                    </div>
                )}
            </div>

            <style jsx global>{`
                .psv-loader, .psv-loader-text {
                    display: none !important;
                }

                @keyframes spin-slow {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
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
                    box-shadow: 0 10px 25px rgba(254, 77, 1, 0.4) !important;
                    transition: all 0.3s ease !important;
                    animation: pulse-marker 2s infinite !important;
                }

                @keyframes pulse-marker {
                    0%, 100% {
                        transform: scale(1);
                        box-shadow: 0 0 15px rgba(254, 77, 1, 0.4);
                    }
                    50% {
                        transform: scale(1.1);
                        box-shadow: 0 0 30px rgba(255, 127, 50, 0.6);
                    }
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
                    box-shadow: 0 8px 25px rgba(255, 150, 0, 0.5) !important;
                    transition: all 0.3s ease !important;
                }

                .info-marker:hover {
                    transform: scale(1.2) rotate(360deg) !important;
                }

                .psv-container {
                    background: #0a0500 !important;
                }

                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }

                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }

                @media (max-width: 768px) {
                    .custom-marker {
                        width: 38px !important;
                        height: 38px !important;
                        font-size: 18px !important;
                        box-shadow: 0 6px 20px rgba(254, 77, 1, 0.35) !important;
                    }

                    .info-marker {
                        width: 32px !important;
                        height: 32px !important;
                        font-size: 16px !important;
                        box-shadow: 0 6px 18px rgba(255, 150, 0, 0.4) !important;
                    }
                }
            `}</style>
        </>
    );
}
