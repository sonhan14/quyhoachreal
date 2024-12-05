import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { SketchPicker } from 'react-color';
import './Comment.scss';

const Comment = () => {
  const [comment, setComment] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [color, setColor] = useState('#fff');

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setSelectedImage(URL.createObjectURL(acceptedFiles[0]));
    }
  });

  const handleColorChange = color => {
    setColor(color.hex);
  };

  return (
    <div className="comment-box" style={{ backgroundColor: color }}>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Enter your comment..."
        className="comment-input"
      />
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {selectedImage ? (
          <img src={selectedImage} alt="Selected" className="selected-image" />
        ) : (
          <p>Drag 'n' drop an image, or click to select one</p>
        )}
      </div>
      <SketchPicker color={color} onChangeComplete={handleColorChange} />
      <button className="submit-button">Submit</button>
    </div>
  );
};

export default Comment;
