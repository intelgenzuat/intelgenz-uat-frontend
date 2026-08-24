export const CustomDotAround = (props) => {
  const { cx, cy, value, index, ...rest } = props;
  if (!value) return null;
  // Use index to give slightly different variations if needed, or just a fixed speed
  const animClass = index % 2 === 0 ? 'dot-rotate-medium' : 'dot-rotate-slow-reverse';
  return (
    <g className={animClass} {...rest} style={{ cursor: 'pointer' }}>
      <circle cx={cx} cy={cy} r={4} fill="#ff1a5f" />
    </g>
  );
};

export const CustomDotAway = (props) => {
  const { cx, cy, value, index, ...rest } = props;
  if (!value) return null;
  const animClass = index % 2 === 0 ? 'dot-rotate-slow' : 'dot-rotate-medium';
  return (
    <g className={animClass} {...rest} style={{ cursor: 'pointer' }}>
      <circle cx={cx} cy={cy} r={6} fill="rgba(168, 85, 247, 0.2)" />
      <circle cx={cx} cy={cy} r={3} fill="#a855f7" />
    </g>
  );
};

export const CustomDotGlobal = (props) => {
  const { cx, cy, value, index, ...rest } = props;
  if (!value) return null;
  const animClass = index % 2 === 0 ? 'dot-rotate-fast' : 'dot-rotate-medium-reverse';
  // Note: I'll add medium-reverse to SCSS if it's missing, or just use slow-reverse
  return (
    <g className={index % 3 === 0 ? 'dot-rotate-fast' : 'dot-rotate-slow'} {...rest} style={{ cursor: 'pointer' }}>
      <circle cx={cx} cy={cy} r={8} fill="rgba(245, 158, 11, 0.15)" />
      <circle cx={cx} cy={cy} r={5} fill="#fff" />
      <circle cx={cx} cy={cy} r={4} fill="#f59e0b" />
    </g>
  );
};

export const renderRadarBackground = () => (
  <svg x="50%" y="50%" style={{ overflow: 'visible' }}>
    {/* Inner pink background (Around You range) */}
    <circle cx="0" cy="0" r="38" fill="#ffe8eb" opacity={0.6} />
    {/* Center green background */}
    <circle cx="0" cy="0" r="22" fill="#ffff" />
    <circle cx="0" cy="0" r="15" fill="#00b85c" />
    
    {/* New SVG Icon Area */}
    <g transform="translate(-6, -6)">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M4.11438 0.151367C3.43746 0.151367 2.78829 0.41371 2.30964 0.880682L0 3.13398V4.16539C0 4.89408 0.320832 5.54967 0.832203 6.00502C0.320832 6.46038 0 7.11596 0 7.84465V8.87607L2.30964 11.1294C2.78829 11.5963 3.43746 11.8587 4.11438 11.8587C4.86129 11.8587 5.53326 11.5457 6 11.0468C6.46674 11.5457 7.13871 11.8587 7.88562 11.8587C8.56254 11.8587 9.21171 11.5963 9.69036 11.1294L12 8.87607V7.84465C12 7.11596 11.6792 6.46038 11.1678 6.00502C11.6792 5.54967 12 4.89408 12 4.16539V3.13398L9.69036 0.880682C9.21171 0.41371 8.56254 0.151367 7.88562 0.151367C7.13871 0.151367 6.46674 0.464373 6 0.963272C5.53326 0.464373 4.86129 0.151367 4.11438 0.151367ZM7.72764 6.00502C7.69887 5.97941 7.67064 5.9531 7.64298 5.92611L6 4.32321L4.35702 5.92611C4.32936 5.9531 4.30113 5.97941 4.27236 6.00502C4.30113 6.03063 4.32936 6.05694 4.35702 6.08393L6 7.68684L7.64298 6.08393C7.67064 6.05694 7.69887 6.03063 7.72764 6.00502ZM6.66666 8.87607V9.36865C6.66666 10.0254 7.21242 10.5579 7.88562 10.5579C8.2089 10.5579 8.51895 10.4326 8.74755 10.2096L10.6667 8.33724V7.84465C10.6667 7.18787 10.1209 6.65542 9.44772 6.65542C9.12444 6.65542 8.81439 6.78072 8.58579 7.00374L6.66666 8.87607ZM5.33334 8.87607L3.41421 7.00374C3.18561 6.78072 2.87557 6.65542 2.55229 6.65542C1.87908 6.65542 1.33333 7.18787 1.33333 7.84465V8.33724L3.25245 10.2096C3.48105 10.4326 3.7911 10.5579 4.11438 10.5579C4.78758 10.5579 5.33334 10.0254 5.33334 9.36865V8.87607ZM5.33334 2.6414V3.13398L3.41421 5.0063C3.18561 5.22932 2.87557 5.35462 2.55229 5.35462C1.87908 5.35462 1.33333 4.82217 1.33333 4.16539V3.67281L3.25245 1.80049C3.48105 1.57747 3.7911 1.45218 4.11438 1.45218C4.78758 1.45218 5.33334 1.98461 5.33334 2.6414ZM8.58579 5.0063L6.66666 3.13398V2.6414C6.66666 1.98461 7.21242 1.45218 7.88562 1.45218C8.2089 1.45218 8.51895 1.57747 8.74755 1.80049L10.6667 3.67281V4.16539C10.6667 4.82217 10.1209 5.35462 9.44772 5.35462C9.12444 5.35462 8.81439 5.22932 8.58579 5.0063Z" fill="white"/>
    </g>
  </svg>
);
