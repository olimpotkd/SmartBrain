import "./FaceRecognition.css";

interface Props {
  imageUrl: string;
  box: Array<Box> | null;
}

const FaceRecognition = ({ imageUrl, box }: Props) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img
          id="inputimage"
          src={imageUrl}
          alt=""
          width="500px"
          height="auto"
        />
        {box?.map((boxx, index) => (
          <div
            key={index}
            className="bounding-box"
            style={{
              top: boxx.topRow,
              right: boxx.rightCol,
              bottom: boxx.bottomRow,
              left: boxx.leftCol,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default FaceRecognition;
