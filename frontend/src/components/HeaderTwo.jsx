import "./HeaderTwo.css"; 

export const HeaderTwo = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1>A reader lives a thousand lives</h1>
        <p>The man who never reads lives only one.</p>
      </div>
      <div className="header-picture">
        <div className="picture-box">Picture</div>
      </div>
    </header>
  );
}

export default HeaderTwo;