import React from 'react'
import './VideoPlayer.scss'

const VideoPlayer = ({videoUrl}) => {
  return (
    <div className='video-container'>
        <video className='video-player' controls>
            <source src={videoUrl} type='video/mp4' />
        </video>
    </div>
  )
}

export default VideoPlayer
