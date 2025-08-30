import withRootStore from '@/src/HOCs/withRootStore'
import TabNavigator from '@/src/navigation/TabNavigator/TabNavigator'
import React from 'react'
import { StyleSheet, View } from 'react-native'

const MainScreen = () => {
  return (
    <View style={[styles.container]}  >
      <TabNavigator initialRoute={'Home'} />
    </View>
  )
}

export default withRootStore(MainScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})