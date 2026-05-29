import React from 'react';

const images = [
  { name: 'IMG_4035', path: '/tmp/IMG_4035.jpg' },
  { name: 'IMG_4036', path: '/tmp/IMG_4036.jpg' },
  { name: 'IMG_8014', path: '/tmp/IMG_8014.jpg' },
  { name: 'IMG_8016', path: '/tmp/IMG_8016.jpg' },
  { name: 'IMG_8017', path: '/tmp/IMG_8017.jpg' },
  { name: 'IMG_8018', path: '/tmp/IMG_8018.jpg' },
  { name: 'DSC_2275', path: '/tmp/DSC_2275.jpg' },
  { name: 'DSC_2277', path: '/tmp/DSC_2277.jpg' },
  { name: 'DSC_2278', path: '/tmp/DSC_2278.jpg' },
  { name: 'DSC_2280', path: '/tmp/DSC_2280.jpg' },
  { name: 'DSC_2281', path: '/tmp/DSC_2281.jpg' },
  { name: 'DSC_2282', path: '/tmp/DSC_2282.jpg' },
  { name: 'DSC_2324', path: '/tmp/DSC_2324.jpg' },
  { name: 'DSC_2327', path: '/tmp/DSC_2327.jpg' },
  { name: 'DSC_2336', path: '/tmp/DSC_2336.jpg' },
  { name: 'DSC_2339', path: '/tmp/DSC_2339.jpg' },
  { name: 'DSC_2347', path: '/tmp/DSC_2347.jpg' },
  { name: 'DSC_2350', path: '/tmp/DSC_2350.jpg' },
];

export default function DebugImages() {
  return (
    <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
      {images.map((img) => (
        <div key={img.name}>
          <p style={{ fontWeight: 'bold', fontSize: 14 }}>{img.name}</p>
          <img 
            src={img.path} 
            alt={img.name} 
            style={{ width: '100%', height: 300, objectFit: 'cover', border: '2px solid #333' }} 
          />
        </div>
      ))}
    </div>
  );
}
