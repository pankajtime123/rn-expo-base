import PageHeader from '@/src/components/Headers/PageHeader/PageHeader';
import AppText from '@/src/components/ui/AppText/AppText';
import AppView from '@/src/components/ui/AppView/AppView';
import React from 'react';
import { StyleSheet } from 'react-native';

const RoughScreen = () => {

  return (
    <AppView style={styles.container} >
      <PageHeader.Spaced showLeft={false} />
      <AppText>
      </AppText>
    </AppView>
  )
}

export default RoughScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})


