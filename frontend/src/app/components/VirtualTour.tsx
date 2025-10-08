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
  const [currentScene, setCurrentScene] = useState('scene1');

  // Definisi scene-scene dalam tour
  const scenes: Scene[] = [
    {
      id: 'scene1',
      panorama: 'https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg',
      name: 'Ruang Tamu',
      markers: [
        {
          id: 'marker1',
          position: { yaw: '0deg', pitch: '0deg' },
          html: '<div class="custom-marker">→</div>',
          tooltip: 'Ke Dapur',
          data: { targetScene: 'scene2' }
        },
        {
          id: 'info1',
          position: { yaw: '1.5rad', pitch: '-0.3rad' },
          html: '<div class="info-marker">ℹ️</div>',
          tooltip: 'Ruang tamu dengan pemandangan luas'
        }
      ]
    },
    {
      id: 'scene2',
      panorama: 'https://photo-sphere-viewer-data.netlify.app/assets/sphere-test.jpg',
      name: 'Dapur',
      markers: [
        {
          id: 'marker2',
          position: { yaw: '3.14rad', pitch: '0deg' },
          html: '<div class="custom-marker">←</div>',
          tooltip: 'Kembali ke Ruang Tamu',
          data: { targetScene: 'scene1' }
        },
        {
          id: 'info2',
          position: { yaw: '0.5rad', pitch: '-0.2rad' },
          html: '<div class="info-marker">ℹ️</div>',
          tooltip: 'Dapur modern dengan peralatan lengkap'
        }
      ]
    }
  ];

  useEffect(() => {
    if (!viewerContainer.current) return;

    // Inisialisasi viewer
    const viewer = new Viewer({
      container: viewerContainer.current,
      panorama: scenes[0].panorama,
      plugins: [
        [MarkersPlugin, {
          markers: scenes[0].markers
        }]
      ],
      navbar: [
        'zoom',
        'move',
        'fullscreen',
        {
          id: 'scene-info',
          content: `<div style="padding: 0 10px; color: white;">${scenes[0].name}</div>`,
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

    const viewer = viewerInstance.current;
    const markersPlugin = viewer.getPlugin(MarkersPlugin);

    // Update panorama
    viewer.setPanorama(scene.panorama).then(() => {
      // Clear dan update markers
      markersPlugin?.clearMarkers();
      scene.markers.forEach(marker => {
        markersPlugin?.addMarker(marker);
      });

      // Update navbar info
      const navbar = viewer.navbar.getButton('scene-info');
      if (navbar) {
        navbar.content = `<div style="padding: 0 10px; color: white;">${scene.name}</div>`;
      }

      setCurrentScene(sceneId);
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
          transition: all 0.3s;
          font-size: 13px;
        }

        .scene-selector button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .scene-selector button.active {
          background: rgba(59, 130, 246, 0.8);
          border-color: rgba(59, 130, 246, 1);
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