import PageHeader from '@/src/components/Headers/PageHeader/PageHeader';
import AppPressable from '@/src/components/ui/AppPressable/AppPressable';
import AppRow from '@/src/components/ui/AppRow/AppRow';
import AppView from '@/src/components/ui/AppView/AppView';
import React, { useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';

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
      <AppRow w={200} center gap={10} style={{ flexWrap: 'wrap', marginTop: 20, alignSelf: 'center' }}>
        {squares.map((square) => {
          const isSelected = selectedSquares.includes(square.id);
          return <AppPressable onPress={() => onPressSquare(square.id)} key={square.id} w={50} h={50} bg={isSelected ? 'red' : 'green'} />
        }
        )}
      </AppRow>
    </AppView>
  )
}

export default RoughScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})