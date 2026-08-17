import React from 'react';
import { Link } from 'react-router-dom';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
};

/**
 * Shared button. Renders a <Link> when `to` is given, else a <button>.
 */
const Button = ({ to, variant = 'primary', className = '', children, ...rest }) => {
  const classes = `${variants[variant]} ${className}`.trim();
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
};

export default Button;
