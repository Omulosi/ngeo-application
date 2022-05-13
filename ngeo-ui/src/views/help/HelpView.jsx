/* eslint-disable react/prop-types */
import React from 'react';
import userManualPdf from 'src/data/userManual.pdf';

const HelpView = () => {
  return (
    <div>
      <embed
        src={userManualPdf}
        type="application/pdf"
        style={{
          height: '100vh',
          width: '100vw'
        }}
      />
    </div>
  );
};

export default HelpView;
