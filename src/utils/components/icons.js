import React from 'react';
import styled from 'styled-components';

const MaterialIconBase = styled.span`
  font-family: 'Material Icons', serif;
  font-weight: normal;
  font-style: normal;
  font-size: ${({ size }) => (size ? size : '24px')};
  color: ${({ color }) => (color ? color : 'black')};
`;

export const MaterialIcon = ({ iconName, size, color }) => (
    <MaterialIconBase size={size} color={color}>
      {iconName}
    </MaterialIconBase>
);

const SvgIconBase = styled.div`
  display: inline-block;
  svg {
    width: ${({ size }) => (size ? size : '24px')};
    height: ${({ size }) => (size ? size : '24px')};
    fill: ${({ color }) => (color ? color : 'black')};
  }
`;

export const SvgIcon = ({ svgContent, size, color }) => (
    <SvgIconBase size={size} color={color}>
      {svgContent}
    </SvgIconBase>
);