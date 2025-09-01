import BaseExpoButton from '@/src/components/base/buttons/BaseExpoButton';
import PageHeader from '@/src/components/Headers/PageHeader/PageHeader';
import AppText from '@/src/components/ui/AppText/AppText';
import AppView from '@/src/components/ui/AppView/AppView';
import { screenWidth } from '@/src/utils/resizing';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import Typehead from '../FaltuScreens/Typehead';

const squares = Array.from({ length: 5 }).map((_, i) => ({ id: i.toString() }));

const RoughScreen = () => {
  const [selectedSquares, setSelectedSquares] = React.useState<string[]>([]);
  const onPressSquare = useCallback((id: string) => {
    setSelectedSquares((prev) => ([...prev, id]))
  }, []);

  useEffect(() => {
    let timerId: ReturnType<typeof setInterval>;
    if (selectedSquares.length === squares.length) {
      timerId = setInterval(() => {
        setSelectedSquares(prev => {
          const newSquares = [...prev];
          if (newSquares.length > 0) {
            newSquares.pop();
          }
          if (newSquares.length === 0) {
            clearInterval(timerId)
          }
          return newSquares;
        })
      }, 1000)
    }
  }, [selectedSquares])

  return (
    <AppView style={styles.container} >
      <PageHeader.Spaced showLeft={false} />
      {/* <AppRow w={200} center gap={10} style={{ flexWrap: 'wrap', marginTop: 20, alignSelf: 'center' }}>
        {squares.map((square) => {
          const isSelected = selectedSquares.includes(square.id);
          return <AppPressable onPress={() => onPressSquare(square.id)} key={square.id} w={50} h={50} bg={isSelected ? 'red' : 'green'} />
        }
        )}
      </AppRow>
      <Timer /> */}

      <Typehead />
    </AppView>
  )
}

export default RoughScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

const timeValue = 60 * 60 * 5

const Timer = () => {
  const [time, setTime] = useState(timeValue)
  const timerRef = useRef<number>(0)

  const handleStart = useCallback(()=>{
    timerRef.current = setInterval(()=>{
           setTime(p=> p - 1)
    },1000)
  },[])

  const handleStop = useCallback(()=>{
      clearInterval(timerRef.current)
  },[])

   const handleReset = useCallback(()=>{
      clearInterval(timerRef.current)
      setTime(timeValue)
  },[])

  

  const hours = Math.floor(time/3600)
  const minutes =  Math.floor((time % 3600)/60)
  const seconds = (time%3600)% 60



  return <AppView gap={20} center flex={1} w={screenWidth} >
    <AppText  color={'red'} >
      {`09: 08: 1999`}
    </AppText>
    <AppText  color={'red'} >
      {`${hours.toString().padStart(2,"00")} : ${minutes.toString().padStart(2,"00")} : ${seconds.toString().padStart(2,"00")}`}
    </AppText>

    <BaseExpoButton.Primary onPress={handleStart} text={'start'} w={screenWidth-40} />
    <BaseExpoButton.Primary onPress={handleStop} text={'stop'} w={screenWidth-40} />
    <BaseExpoButton.Primary onPress={handleReset} text={'reset'} w={screenWidth-40} />

  </AppView>

}