// components/VirtualTour.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';

interface Marker {
  id: string;
  position: { yaw: number; pitch: number };
  html: string;
  tooltip: string;
  data?: {
    targetScene?: string;
  };
}

interface Scene {
  id: string;
  panorama: string;
  name: string;
  markers: Marker[];
}

const VirtualTour = () => {
  const viewerContainer = useRef<HTMLDivElement>(null);
  const viewerInstance = useRef<Viewer | null>(null);
  // Set scene1 sebagai default scene yang akan dimuat pertama kali
  const [currentScene, setCurrentScene] = useState('scene1');

  // Definisi scene-scene dalam tour
  const scenes: Scene[] = [
    {
      id: 'scene1',
      panorama: '/360/v360-1.jpg',
      name: 'Lapangan',
      markers: [
        {
          id: 'marker1',
          position: { yaw: 0, pitch: 0 },
          html: '<div class="custom-marker">→</div>',
          tooltip: 'Ke Dapur',
          data: { targetScene: 'scene2' }
        },
        {
          id: 'info1',
          position: { yaw: 1.5, pitch: -0.3 },
          html: '<div class="info-marker">ℹ️</div>',
          tooltip: 'Ruang tamu dengan pemandangan luas'
        }
      ]
    },
    {
      id: 'scene2',
      panorama: '/360/v360-2.jpg',
      name: 'Indoor',
      markers: [
        {
          id: 'marker2',
          position: { yaw: 3.14, pitch: 0 },
          html: '<div class="custom-marker">←</div>',
          tooltip: 'Kembali ke Ruang Tamu',
          data: { targetScene: 'scene1' }
        },
        {
          id: 'info2',
          position: { yaw: 0.5, pitch: -0.2 },
          html: '<div class="info-marker">ℹ️</div>',
          tooltip: 'Dapur modern dengan peralatan lengkap'
        }
      ]
    },
    {
      id: 'scene3',
      panorama: '/360/v360-3.jpg',
      name: 'Kelas',
      markers: [
        {
          id: 'marker3',
          position: { yaw: 3.14, pitch: 0 },
          html: '<div class="custom-marker">←</div>',
          tooltip: 'Kembali ke Ruang Tamu',
          data: { targetScene: 'scene1' }
        },
        {
          id: 'info3',
          position: { yaw: 0.5, pitch: -0.2 },
          html: '<div class="info-marker">ℹ️</div>',
          tooltip: 'Dapur modern dengan peralatan lengkap'
        }
      ]
    }
  ];

  useEffect(() => {
    if (!viewerContainer.current) return;

    // Pastikan scene1 sebagai default panorama yang akan dimuat pertama kali
    const defaultScene = scenes.find(scene => scene.id === 'scene1') || scenes[0];
    
    // Inisialisasi viewer dengan scene1 (Lapangan) sebagai default scene
    const viewer = new Viewer({
      container: viewerContainer.current,
      panorama: defaultScene.panorama,
      plugins: [
        [MarkersPlugin, {
          markers: defaultScene.markers
        }]
      ],
      navbar: [
        'zoom',
        'move',
        'fullscreen',
        {
          id: 'scene-info',
          content: `<div style="padding: 0 10px; color: white;">${defaultScene.name}</div>`,
          className: 'scene-info-button'
        }
      ]
    });

    viewerInstance.current = viewer;

    // Event handler untuk marker click
    const markersPlugin = viewer.getPlugin(MarkersPlugin);
    markersPlugin?.addEventListener('select-marker', ({ marker }) => {
      if (marker.data?.targetScene) {
        changeScene(marker.data.targetScene);
      }
    });

    return () => {
      viewer.destroy();
    };
  }, []);

  const changeScene = (sceneId: string) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene || !viewerInstance.current) return;

    // Update state terlebih dahulu untuk memastikan tombol aktif ter-update
    setCurrentScene(sceneId);

    const viewer = viewerInstance.current;
    const markersPlugin = viewer.getPlugin(MarkersPlugin);

    // Update panorama
    viewer.setPanorama(scene.panorama).then(() => {
      // Clear dan update markers
      if (markersPlugin && 'clearMarkers' in markersPlugin) {
        (markersPlugin as any).clearMarkers();
        scene.markers.forEach(marker => {
          (markersPlugin as any).addMarker(marker);
        });
      }

      // Update navbar info
      const navbar = viewer.navbar.getButton('scene-info');
      if (navbar) {
        (navbar as any).content = `<div style="padding: 0 10px; color: white;">${scene.name}</div>`;
      }
    });
  };

  return (
    <div className="virtual-tour-container">
      <div ref={viewerContainer} className="viewer-container" />
      
      <div className="scene-selector">
        <h3>Pilih Ruangan:</h3>
        {scenes.map(scene => (
          <button
            key={scene.id}
            onClick={() => changeScene(scene.id)}
            className={currentScene === scene.id ? 'active' : ''}
          >
            {scene.name}
          </button>
        ))}
      </div>

      <style jsx>{`
        .virtual-tour-container {
          width: 100%;
          height: 100vh;
          position: relative;
        }

        .viewer-container {
          width: 100%;
          height: 100%;
        }

        .scene-selector {
          position: absolute;
          top: 20px;
          left: 20px;
          background: rgba(0, 0, 0, 0.7);
          padding: 15px;
          border-radius: 8px;
          color: white;
          z-index: 100;
        }

        .scene-selector h3 {
          margin: 0 0 10px 0;
          font-size: 14px;
          font-weight: 600;
        }

        .scene-selector button {
          display: block;
          width: 100%;
          padding: 8px 12px;
          margin: 5px 0;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 13px;
          outline: none;
        }

        .scene-selector button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .scene-selector button.active {
          background: rgba(59, 130, 246, 0.9) !important;
          border-color: rgba(59, 130, 246, 1) !important;
          color: white !important;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        .scene-selector button.active:hover {
          background: rgba(59, 130, 246, 1) !important;
          transform: translateY(-1px);
        }

        :global(.custom-marker) {
          width: 40px;
          height: 40px;
          background: rgba(59, 130, 246, 0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: white;
          cursor: pointer;
          transition: transform 0.3s;
        }

        :global(.custom-marker:hover) {
          transform: scale(1.2);
        }

        :global(.info-marker) {
          width: 30px;
          height: 30px;
          background: rgba(34, 197, 94, 0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          cursor: pointer;
          transition: transform 0.3s;
        }

        :global(.info-marker:hover) {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
};

export default VirtualTour;