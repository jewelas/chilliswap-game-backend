import { Link } from "react-router-dom";
import React from "react";
import useDarkMode from "use-dark-mode";
const Logo = ({ className, src, srcDark, srcSet, srcSetDark, alt }) => {
  const darkMode = useDarkMode(false);
  return (
    <div className="logo">
      <Link to="/">
        <img
          className={className}
          srcSet={darkMode.value ? srcSetDark : srcSet}
          src={darkMode.value ? srcDark : src}
          alt={alt}
        />
      </Link>
    </div>
  );
};
export default Logo;
