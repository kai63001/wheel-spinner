import React from 'react';
import styled from 'styled-components';

const CircularText = ({ text, radius = 6.62626, fontSize = 2 }) => {
  const characters = text.split('');
  const deg = 60 / characters.length;

  return (
    <Wrapper fontSize={fontSize}>
      <div aria-label={text}>
        {characters.map((char, i) => (
          <Span
            key={`${char}-${i}`}
            rotate={(i - characters.length / 2.2) * deg}
            radius={radius}
            //text shadow
            className=' text-white'
            style={{ textShadow: '0 0 10px #000' }}
          >
            {char}
          </Span>
        ))}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  height: ${props => props.fontSize * 2.33886}em;
  font-size: ${props => props.fontSize}em;
`;

const Span = styled.span`
  position: absolute;
  bottom: auto;
  left: 50%;
  transform: translateX(-50%) rotate(${props => props.rotate}deg);
  transform-origin: center ${props => props.radius}em;
`;

export default CircularText;