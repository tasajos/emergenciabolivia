declare module 'react-native-progress/Bar' {
    import { Component } from 'react';
    import { ViewStyle } from 'react-native';
  
    interface ProgressBarProps {
      progress?: number;
      indeterminate?: boolean;
      width?: number | null;
      height?: number;
      color?: string;
      unfilledColor?: string;
      borderColor?: string;
      borderWidth?: number;
      borderRadius?: number;
      animationType?: 'decay' | 'timing' | 'spring';
      style?: ViewStyle;
      children?: React.ReactNode;
    }
  
    export default class ProgressBar extends Component<ProgressBarProps> {}
  }
  