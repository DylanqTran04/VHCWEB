import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const trails = {
  "Southern California": ["Mount Baldy", "Runyon Canyon", "Escondido Falls", "Bridge to Nowhere", "Solstice Canyon",
    "Sturtevant Falls", "Switzer Falls", "Sandstone Peak", "Topanga Lookout", "Echo Mountain"],
  "Northern California": ["Yosemite Falls Trail", "Mount Tamalpais", "Lands End", "Muir Woods", "Mission Peak",
    "Cascade Falls", "Eagle Lake Trail", "Mount Diablo", "Berry Creek Falls", "Castle Rock State Park"],
  "Coastal Areas": ["Torrey Pines", "Point Lobos", "Big Sur", "Malibu Bluffs", "Half Moon Bay",
    "Pfeiffer Beach", "Montaña de Oro", "Dillon Beach", "Crystal Cove", "Stinson Beach"]
};

const imageMap = {
  "Mount Baldy": "/mountbaldy.png",
  "Runyon Canyon": "/runyoncanyon.png",
  "Escondido Falls": "/escondidofalls.png",
  "Bridge to Nowhere": "/bridgetonowhere.png",
  "Solstice Canyon": "/solsticecanyon.png",
  "Sturtevant Falls": "/sturtevantfalls.png",
  "Switzer Falls": "/switzerfalls.png",
  "Sandstone Peak": "/sandstonepeak.png",
  "Topanga Lookout": "/topangalookout.png",
  "Echo Mountain": "/echomountain.png",
  "Yosemite Falls Trail": "/yosemitefalls.png",
  "Mount Tamalpais": "/mounttamalpais.png",
  "Lands End": "/landsend.png",
  "Muir Woods": "/muirwoods.png",
  "Mission Peak": "/missionpeak.png",
  "Cascade Falls": "/cascadefalls.png",
  "Eagle Lake Trail": "/eaglelake.png",
  "Mount Diablo": "/mountdiablo.png",
  "Berry Creek Falls": "/berrycreekfalls.png",
  "Castle Rock State Park": "/castlerock.png",
  "Torrey Pines": "/torreypines.png",
  "Point Lobos": "/pointlobos.png",
  "Big Sur": "/bigsur.png",
  "Malibu Bluffs": "/malibubluffs.png",
  "Half Moon Bay": "/halfmoonbay.png",
  "Pfeiffer Beach": "/pfeifferbeach.png",
  "Montaña de Oro": "/montanadeoro.png",
  "Dillon Beach": "/dillonbeach.png",
  "Crystal Cove": "/crystalcove.png",
  "Stinson Beach": "/stinsonbeach.png"
};

// Removed transparency from the boxes and images for each location.
const globalFontStyle = {
  fontFamily: 'Roboto, sans-serif'
};

export default function Home() {
  const [interests, setInterests] = useState({});
  const [names, setNames] = useState({});
  const [dates, setDates] = useState({});
  const [hikerOpacity, setHikerOpacity] = useState(1); // State to control hiker opacity

  const hikerRef = useRef(null);
  const locationRefs = useRef([]);

  const handleInterest = (region, trail) => {
    const key = `${region}-${trail}`;
    const name = names[key];
    if (!name) return;
    setInterests((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), name]
    }));
    setNames((prev) => ({ ...prev, [key]: "" }));
  };

  const handleDateSelect = (key, date) => {
    setDates((prev) => ({ ...prev, [key]: date }));
  };

  const isPopular = (key) => (interests[key]?.length || 0) >= 10;

  const { scrollYProgress } = useScroll();
  const isBrowser = typeof window !== 'undefined';

  const y = isBrowser ? useTransform(scrollYProgress, [0, 1], [0, -window.innerHeight * 2.25]) : null;
  const x = isBrowser ? useTransform(scrollYProgress, [0, 1], [0, -window.innerWidth * 0.65]) : null;

  // Updated to ensure the hiker turns transparent under the given conditions.
  useEffect(() => {
    const handleScroll = () => {
      if (!hikerRef.current || locationRefs.current.length === 0) return;

      const hikerRect = hikerRef.current.getBoundingClientRect();
      const mountainElement = document.querySelector('img[alt="Mountain Background"]');
      const mountainRect = mountainElement?.getBoundingClientRect();

      let isOverlapping = false;

      locationRefs.current.forEach((locationRef) => {
        if (!locationRef) return;
        const locationRect = locationRef.getBoundingClientRect();

        // Check if any part of the hiker overlaps with a location box
        if (
          hikerRect.top < locationRect.bottom &&
          hikerRect.bottom > locationRect.top &&
          hikerRect.left < locationRect.right &&
          hikerRect.right > locationRect.left
        ) {
          isOverlapping = true;
        }
      });

      // Check if hiker overlaps with the mountain
      const isTouchingMountain =
        mountainRect &&
        hikerRect.top < mountainRect.bottom &&
        hikerRect.bottom > mountainRect.top &&
        hikerRect.left < mountainRect.right &&
        hikerRect.right > mountainRect.left;

      if (isTouchingMountain) {
        setHikerOpacity(1); // Ensure hiker is fully visible
        hikerRef.current.style.opacity = '1'; // Apply opacity directly
        hikerRef.current.style.fontWeight = 'bold'; // Make hiker bold
      } else if (isOverlapping) {
        setHikerOpacity(0.5); // Make hiker transparent if overlapping with location boxes
        hikerRef.current.style.opacity = '0.5'; // Apply opacity directly
        hikerRef.current.style.fontWeight = 'normal'; // Adjust font weight
      } else {
        setHikerOpacity(1); // Reset hiker opacity
        hikerRef.current.style.opacity = '1'; // Apply opacity directly
        hikerRef.current.style.fontWeight = 'bold'; // Reset font weight
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '300vh',
        overflow: 'hidden',
        ...globalFontStyle // Apply global font style
      }}
    >
      {/* 🏔️ Mountain full background */}
      <img
        src="/mountain.png"
        alt="Mountain Background"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: -1,
          opacity: 0.9
        }}
      />

      {/* 🧍 Hiker climbing diagonally */}
      <motion.img
        ref={hikerRef} // Attach ref to hiker
        src="/hiker.png"
        alt="Hiker"
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          width: '90px',
          zIndex: 1000,
          x,
          y,
          opacity: hikerOpacity // Dynamically control opacity
        }}
      />

      {/* Page content */}
      <div style={{
        backgroundColor: '#e0f2e9',
        padding: '1rem',
        borderRadius: '8px',
        ...globalFontStyle // Apply global font style
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{
            textAlign: 'center',
            color: '#2e4d2e',
            margin: 0,
            ...globalFontStyle // Apply global font style
          }}>
            
          </h1>
          <img
            src="/vhclogo.png" // Example PNG next to the title
            alt="VHC Logo"
            style={{ width: '500px', height: '250px', marginLeft: '10px' }}
          />
        </div>

        <p style={{ textAlign: 'center', marginTop: '1rem', ...globalFontStyle }}>
          Follow us on Facebook:
          <a
            href="https://www.facebook.com/groups/2061827307206360/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginLeft: '0.5rem', color: '#3b5998', textDecoration: 'underline', ...globalFontStyle }}
          >
            Vietnamese Hiking Group
          </a>
        </p>

        <p style={{ textAlign: 'center', marginTop: '1rem', ...globalFontStyle }}>
          Hello welcome to VHC California interest board! Once a hike has 10 people interested, a calendar will open allowing the group to plan a date that works best with everyone!
        </p>
      </div>

      {Object.entries(trails).map(([region, trailList], index) => (
        <div
          key={region}
          ref={(el) => (locationRefs.current[index] = el)} // Attach ref to each location box
          style={{ marginTop: '2rem', ...globalFontStyle }}
        >
          <h2 style={{ color: '#4e3b2c', borderBottom: '2px solid #a78f64', ...globalFontStyle }}>{region}</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem',
              justifyContent: 'center',
              ...globalFontStyle
            }}
          >
            {trailList.map((trail) => {
              const key = `${region}-${trail}`;
              const imageSrc = imageMap[trail] || "/default.png"; // Fallback to default image if not found
              return (
                <div
                  key={trail}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    maxWidth: '300px',
                    width: '100%',
                    margin: '0 auto',
                    border: '1px solid #a78f64',
                    borderRadius: '10px',
                    padding: '1rem',
                    backgroundColor: isPopular(key) ? '#d8f3dc' : '#fff',
                    ...globalFontStyle
                  }}
                >
                  <img
                    src={imageSrc}
                    alt={trail}
                    style={{ width: '150px', height: '120px', marginRight: '1rem', borderRadius: '5px' }}
                  />
                  <div>
                    <strong style={{ color: '#2f4f2f', ...globalFontStyle }}>{trail}</strong>
                    <div style={{ marginTop: '0.5rem', ...globalFontStyle }}>
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={names[key] || ""}
                        onChange={(e) => setNames({ ...names, [key]: e.target.value })}
                        style={{ marginRight: '0.5rem', padding: '0.25rem', borderColor: '#a78f64', ...globalFontStyle }}
                      />
                      <button
                        onClick={() => handleInterest(region, trail)}
                        style={{
                          backgroundColor: '#3e7c3e',
                          color: '#fff',
                          padding: '0.3rem 0.6rem',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          ...globalFontStyle
                        }}
                      >
                        I'm Interested
                      </button>
                    </div>
                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', ...globalFontStyle }}>
                      {interests[key]?.length || 0} people interested
                    </p>
                    {isPopular(key) && (
                      <div style={{ marginTop: '0.5rem', ...globalFontStyle }}>
                        <p style={{ fontWeight: 'bold', ...globalFontStyle }}>Select a Date:</p>
                        <input
                          type="date"
                          onChange={(e) => handleDateSelect(key, e.target.value)}
                          style={{ padding: '0.3rem', borderColor: '#4e3b2c', ...globalFontStyle }}
                        />
                        {dates[key] && <p style={{ ...globalFontStyle }}>Selected: {dates[key]}</p>}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{
        backgroundColor: 'rgba(23, 114, 211, 0.87)',
        padding: '1rem',
        borderRadius: '8px',
        marginTop: '2rem',
        ...globalFontStyle
      }}>
        <h2 style={{ textAlign: 'center', color: 'black', fontWeight: 'bold', marginBottom: '1rem', ...globalFontStyle }}>
          Get to know us!
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', ...globalFontStyle }}>
          <img src="/LISA.png" alt="Hiker" style={{ maxWidth: '1500px', borderRadius: '10px' }} />
          <img src="/vhcstarph.png" alt="Mountain" style={{ maxWidth: '1500px', borderRadius: '10px' }} />
          <img src="/group1vhc.png" alt="Hiker" style={{ maxWidth: '1500px', borderRadius: '10px' }} />
          <img src="/vhcstairs.png" alt="Hiker" style={{ maxWidth: '1500px', borderRadius: '10px' }} />
          <img src="/snowvhc.png" alt="Hiker" style={{ maxWidth: '1500px', borderRadius: '10px' }} />
          <img src="/aodaivhc.png" alt="Hiker" style={{ maxWidth: '1500px', borderRadius: '10px' }} />
          <img src="/sunsetvhc.png" alt="Hiker" style={{ maxWidth: '1500px', borderRadius: '10px' }} />
        </div>
      </div>

      {/* Merch section */}
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '1rem',
        borderRadius: '8px',
        marginTop: '2rem',
        ...globalFontStyle
      }}>
        <h2 style={{ textAlign: 'center', color: '#333', fontWeight: 'bold', marginBottom: '1rem', ...globalFontStyle }}>
          Merch
        </h2>
        <p style={{ textAlign: 'center', ...globalFontStyle }}>
          Check out our official merchandise and support the group! Fill out the form below to place your order:
        </p>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSf5_XBskBLg-BM5NAWmU-MupuJFpamUHS-eRdlHoDq7nABcnQ/viewform?usp=header" // Replace with the actual Google Form link
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              backgroundColor: '#007bff',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 'bold',
              ...globalFontStyle
            }}
          >
            Order Merch
          </a>
        </div>
      </div>
    </div>
  );
}
