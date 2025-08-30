// src/hocs/withRootStore.tsx
import { inject, observer } from 'mobx-react';
import React from 'react';

// HOC to inject rootStore and observe the component
const withRootStore = (WrappedComponent: React.ComponentType<any>) => {
  return inject('rootStore')(observer(WrappedComponent));
};

export default withRootStore;