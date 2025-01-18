import React from 'react';

interface SomeComponentProps {
  hy: boolean | string;
}

const SomeComponent: React.FC<SomeComponentProps> = ({ hy }) => {
  return <div>{hy.toString()}</div>;
};

const MyComponent = () => {
  const someBoolean = true;
  //Example 1: Boolean value
  return (
    <div>
      <SomeComponent hy={someBoolean} />
      {/* Example 2: String value */}
      <SomeComponent hy={someBoolean ? "true" : "false"} />
      {/* Example 3:  Boolean value passed as string (before update) */}
      {/* <SomeComponent hy={someBoolean.toString()} /> */}
      {/* Example 4: String value (before update) */}
      {/* <SomeComponent hy={"true"} /> */}

    </div>
  );
};

export default MyComponent;

