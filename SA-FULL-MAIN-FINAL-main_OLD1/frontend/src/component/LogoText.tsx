import React, { useState, useEffect } from 'react';

const SongThor = () => {
  const text = 'SongThor';
  const [highlightIndex, setHighlightIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightIndex((prevIndex) => (prevIndex + 1) % text.length);
    }, 430); // ความเร็วในการเปลี่ยนสี (300ms)
    return () => clearInterval(interval);
  }, [text.length]);

  return (
    <div>
      {text.split('').map((char, index) => (
        <span
          key={index}
          style={{
            color: index === highlightIndex ? 'orange' : 'white', // เฉพาะตัวที่อยู่ใน highlightIndex เป็นสีแดง ตัวอื่นกลับเป็นสีดำ
            transition: 'color 0.6s ease', // ให้การเปลี่ยนสีเนียน
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};

export default SongThor;
