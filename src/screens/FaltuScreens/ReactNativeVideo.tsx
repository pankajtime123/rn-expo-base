import { Ionicons } from '@expo/vector-icons';
import { useKeepAwake } from 'expo-keep-awake';
import * as ScreenOrientation from 'expo-screen-orientation';
import { VideoView, useVideoPlayer } from 'expo-video';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    PanResponder,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CustomVideoPlayer = ({ 
  videoUri, 
  poster,
  autoPlay = false,
  loop = false,
  muted = false 
}) => {
  // Keep screen awake during video playback
  useKeepAwake();

  // Video player setup
  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = loop;
    player.muted = muted;
    if (autoPlay) {
      player.play();
    }
  });

  // State management
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  // Refs and animations
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const hideControlsTimer = useRef(null);
  const volumeSliderRef = useRef(null);
  const seekSliderRef = useRef(null);

  // Auto-hide controls
  const resetControlsTimer = () => {
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }
    
    setShowControls(true);
    Animated.timing(controlsOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    if (isPlaying) {
      hideControlsTimer.current = setTimeout(() => {
        hideControls();
      }, 3000);
    }
  };

  const hideControls = () => {
    Animated.timing(controlsOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowControls(false);
    });
  };

  // Video event handlers
  useEffect(() => {
    const statusListener = (status) => {
      setIsLoading(status.isLoaded === false);
      if (status.isLoaded) {
        setDuration(status.duration || 0);
        setCurrentTime(status.currentTime || 0);
        setIsPlaying(status.isPlaying || false);
      }
    };

    const subscription = player.addListener('playingChange', statusListener);
    return () => subscription?.remove();
  }, [player]);

  // Update current time
  useEffect(() => {
    const interval = setInterval(() => {
      if (player && isPlaying) {
        setCurrentTime(player.currentTime || 0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [player, isPlaying]);

  // Control functions
  const togglePlayPause = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
    setIsPlaying(!isPlaying);
    resetControlsTimer();
  };

  const seekTo = (time) => {
    player.seekBy(time - currentTime);
    setCurrentTime(time);
  };

  const skipForward = () => {
    const newTime = Math.min(currentTime + 10, duration);
    seekTo(newTime);
    resetControlsTimer();
  };

  const skipBackward = () => {
    const newTime = Math.max(currentTime - 10, 0);
    seekTo(newTime);
    resetControlsTimer();
  };

  const toggleMute = () => {
    player.muted = !player.muted;
    resetControlsTimer();
  };

  const changeVolume = (newVolume) => {
    setVolume(newVolume);
    player.volume = newVolume;
  };

  const changePlaybackRate = () => {
    const rates = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    player.playbackRate = nextRate;
    resetControlsTimer();
  };

  const toggleFullscreen = async () => {
    try {
      if (isFullscreen) {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        );
        StatusBar.setHidden(false);
      } else {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
        StatusBar.setHidden(true);
      }
      setIsFullscreen(!isFullscreen);
      resetControlsTimer();
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  // Format time helper
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Seek slider component
  const SeekSlider = () => {
    const [seeking, setSeeking] = useState(false);
    const [tempTime, setTempTime] = useState(currentTime);

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          setSeeking(true);
          if (hideControlsTimer.current) {
            clearTimeout(hideControlsTimer.current);
          }
        },
        onPanResponderMove: (event, gestureState) => {
          const sliderWidth = SCREEN_WIDTH - 100;
          const progress = Math.max(0, Math.min(1, gestureState.moveX / sliderWidth));
          const newTime = progress * duration;
          setTempTime(newTime);
        },
        onPanResponderRelease: (event, gestureState) => {
          const sliderWidth = SCREEN_WIDTH - 100;
          const progress = Math.max(0, Math.min(1, gestureState.moveX / sliderWidth));
          const newTime = progress * duration;
          
          seekTo(newTime);
          setSeeking(false);
          resetControlsTimer();
        },
      })
    ).current;

    const progress = seeking ? tempTime / duration : currentTime / duration;

    return (
      <View style={styles.seekContainer}>
        <TouchableOpacity
          style={styles.seekTrack}
          activeOpacity={1}
          onPress={(event) => {
            const { locationX } = event.nativeEvent;
            const sliderWidth = SCREEN_WIDTH - 100;
            const progress = Math.max(0, Math.min(1, locationX / sliderWidth));
            const newTime = progress * duration;
            seekTo(newTime);
            resetControlsTimer();
          }}
        >
          <View style={[styles.seekProgress, { width: `${progress * 100}%` }]} />
          <Animated.View
            style={[
              styles.seekThumb,
              { left: `${Math.max(0, Math.min(100, progress * 100))}%` }
            ]}
            {...panResponder.panHandlers}
          />
        </TouchableOpacity>
      </View>
    );
  };

  // Volume slider component
  const VolumeSlider = () => {
    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gestureState) => {
          const sliderWidth = 100;
          const progress = Math.max(0, Math.min(1, gestureState.moveX / sliderWidth));
          changeVolume(progress);
        },
      })
    ).current;

    return (
      <View style={styles.volumeContainer}>
        <Ionicons 
          name={volume === 0 ? "volume-mute" : "volume-high"} 
          size={20} 
          color="white" 
        />
        <TouchableOpacity
          style={styles.volumeTrack}
          activeOpacity={1}
          onPress={(event) => {
            const { locationX } = event.nativeEvent;
            const sliderWidth = 100;
            const progress = Math.max(0, Math.min(1, locationX / sliderWidth));
            changeVolume(progress);
          }}
        >
          <View style={[styles.volumeProgress, { width: `${volume * 100}%` }]} />
          <Animated.View
            style={[
              styles.volumeThumb,
              { left: `${Math.max(0, Math.min(100, volume * 100))}%` }
            ]}
            {...panResponder.panHandlers}
          />
        </TouchableOpacity>
      </View>
    );
  };

  // Loading indicator
  const LoadingIndicator = () => (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );

  return (
    <View style={[
      styles.container,
      isFullscreen && styles.fullscreenContainer
    ]}>
      <TouchableOpacity
        style={styles.videoContainer}
        activeOpacity={1}
        onPress={resetControlsTimer}
      >
        <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
        />

        {isLoading && <LoadingIndicator />}

        {showControls && (
          <Animated.View
            style={[styles.controls, { opacity: controlsOpacity }]}
            pointerEvents="box-none"
          >
            {/* Top Controls */}
            <View style={styles.topControls}>
              <Text style={styles.title}>Video Player</Text>
              <View style={styles.topRightControls}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={changePlaybackRate}
                >
                  <Text style={styles.playbackRateText}>{playbackRate}x</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={toggleFullscreen}
                >
                  <Ionicons
                    name={isFullscreen ? "contract" : "expand"}
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Center Controls */}
            <View style={styles.centerControls}>
              <TouchableOpacity
                style={styles.skipButton}
                onPress={skipBackward}
              >
                <Ionicons name="play-back" size={32} color="white" />
                <Text style={styles.skipText}>10</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.playPauseButton}
                onPress={togglePlayPause}
              >
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={48}
                  color="white"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.skipButton}
                onPress={skipForward}
              >
                <Ionicons name="play-forward" size={32} color="white" />
                <Text style={styles.skipText}>10</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Controls */}
            <View style={styles.bottomControls}>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </Text>
              </View>

              <SeekSlider />

              <View style={styles.bottomRightControls}>
                <VolumeSlider />
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={toggleMute}
                >
                  <Ionicons
                    name={player.muted ? "volume-mute" : "volume-high"}
                    size={20}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}
      </TouchableOpacity>
    </View>
  );
};

// Example usage component
export const VideoPlayerExample = () => {
  const sampleVideoUri = 'https://youtu.be/Qfd00VQ2W1Y?si=iWgZh5eSuzraEt4-'
  return (
    <View style={styles.exampleContainer}>
      <Text style={styles.exampleTitle}>Custom Video Player</Text>
      <CustomVideoPlayer
        videoUri={sampleVideoUri}
        autoPlay={true}
        loop={false}
        muted={false}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          • Tap to show/hide controls{'\n'}
          • Double tap center to play/pause{'\n'}
          • Drag seek bar to navigate{'\n'}
          • Adjust volume with slider{'\n'}
          • Change playback speed{'\n'}
          • Toggle fullscreen mode
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  exampleContainer: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 50,
  },
  exampleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  container: {
    backgroundColor: '#000',
    aspectRatio: 16 / 9,
  },
  fullscreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: SCREEN_HEIGHT,
    height: SCREEN_WIDTH,
    aspectRatio: undefined,
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  video: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  topRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  playPauseButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    padding: 20,
  },
  skipButton: {
    alignItems: 'center',
    position: 'relative',
  },
  skipText: {
    color: 'white',
    fontSize: 12,
    position: 'absolute',
    top: 8,
    fontWeight: 'bold',
  },
  bottomControls: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  timeContainer: {
    marginBottom: 10,
  },
  timeText: {
    color: 'white',
    fontSize: 14,
  },
  seekContainer: {
    marginBottom: 15,
  },
  seekTrack: {
    height: 40, // Increased touch area
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    position: 'relative',
    justifyContent: 'center',
  },
  seekProgress: {
    height: 4,
    backgroundColor: '#ff4444',
    borderRadius: 2,
    position: 'absolute',
    top: '50%',
    marginTop: -2,
  },
  seekThumb: {
    width: 16,
    height: 16,
    backgroundColor: '#ff4444',
    borderRadius: 8,
    position: 'absolute',
    top: '50%',
    marginTop: -8,
    marginLeft: -8,
  },
  bottomRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 20,
  },
  volumeTrack: {
    height: 30, // Increased touch area
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginLeft: 10,
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  volumeProgress: {
    height: 4,
    backgroundColor: 'white',
    borderRadius: 2,
    position: 'absolute',
    top: '50%',
    marginTop: -2,
  },
  volumeThumb: {
    width: 12,
    height: 12,
    backgroundColor: 'white',
    borderRadius: 6,
    position: 'absolute',
    top: '50%',
    marginTop: -6,
    marginLeft: -6,
  },
  controlButton: {
    padding: 8,
    marginLeft: 10,
  },
  playbackRateText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
  infoContainer: {
    padding: 20,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
  },
});

export default VideoPlayerExample;