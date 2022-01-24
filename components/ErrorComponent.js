import React from 'react';
import GlobalStyles from '../utils/GlobalStyles';
import { Paragraph } from 'react-native-paper';

export default function ErrorComponent({error}) {
  return (
    <Paragraph style={[GlobalStyles.mt4]}>{error}</Paragraph>
  );
}
