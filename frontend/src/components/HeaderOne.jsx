import "./HeaderOne.css";

export const HeaderOne = () => {
  return (
    <div>
      <header className="HeaderOne">
        <h1 className="header-title"> Readers Compass </h1>
      </header>
      <p className="intro-text">
        <span>
          Unlock new worlds of imagination and discover your next favorite read.
        </span>
        <span>
          Sign up, explore curated lists, and let us recommend the perfect book just for you.
        </span>
      </p>
    </div>

  );
};

export default HeaderOne;
