import React, { useState, useEffect } from 'react';
import { css } from '@emotion/css';

export default function   useCustomStyles (styles, theme)  {
  const [classes, setClasses] = useState({});

  useEffect(() => {
    const evaluatedStyles = typeof styles === 'function' ? styles(theme) : styles;
    const generated = {};

    for (const key in evaluatedStyles) {
      generated[key] = css(evaluatedStyles[key]);
    }

    setClasses(generated);
  }, [styles, theme]);

  return classes;
};


