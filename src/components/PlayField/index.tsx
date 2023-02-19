import React from 'react';
import './styles.css';

interface IPlayField {
  data: any[][];
}

export const PlayField: React.FC<IPlayField> = ({ data }) => {
  console.log('data', { data });
  return (
    <div className="container">
      {data.map((row) => (
        <div className="row">
          {row.map((col) => (
            <div className="col">
              <div className="cell">{col.isEmpty ? '' : '#'}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
