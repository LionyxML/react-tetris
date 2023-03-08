import React from 'react';
import './styles.css';

// TODO: proper typing
interface IPlayField {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[][];
}

export const PlayField: React.FC<IPlayField> = ({ data }) => {
  return (
    <div className="container">
      {data.map((row, i) => (
        <div className="row" key={i}>
          {row.map((col, j) => (
            <div className="col" key={j}>
              <div className="cell" style={{ backgroundColor: col.color }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
