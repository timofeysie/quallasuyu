import React from 'react';
import './explore-container.scss';

/* eslint-disable-next-line */
export interface ExploreContainerProps {}

const ExploreContainer = (props: ExploreContainerProps) => {
  return (
    <div className="container">
      <strong>Ready to create an app?</strong>
      <p>
        Start with Ionic{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://ionicframework.com/docs/components"
        >
          UI Components
        </a>
      </p>
    </div>
  );
};

export default ExploreContainer;
