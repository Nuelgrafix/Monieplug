'use client';

import { Next13ProgressBar } from 'next13-progressbar';

const ProgressBar = () => {
  return (
    <Next13ProgressBar
      height="4px"
      color="#F58220"
      z-index="999"
      options={{ showSpinner: false }}
      delay={5000}
      showOnShallow={false}
    />
  );
};

export default ProgressBar;
