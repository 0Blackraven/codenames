const GifComponent = ({url}) => {
    return (
      <img
        src = {url}
        width="250"
        height="250"
        frameBorder="0.001"
        allowFullScreen
        style={{
          background: "transparent",
          border: "none",
        }}
        title="Detective Shushing GIF"
      />
    );
  };
  

export default GifComponent;
