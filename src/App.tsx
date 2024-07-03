import { useEffect, useState } from "react";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import "./App.css";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { ISourceOptions } from "@tsparticles/engine";
import { loadAll } from "@tsparticles/all";

const App = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadAll(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  });
  const [box, setBox] = useState<Box[] | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [route, setRoute] = useState("signin");
  const [input, setInput] = useState("");

  const particlesOptions: ISourceOptions = {
    particles: {
      number: {
        density: {
          enable: true,
        },
        value: 120,
      },
      color: {
        value: "#322c9e",
      },
      links: {
        enable: true,
        color: "random",
        distance: 100,
        opacity: 1,
        frequency: 2,
        width: 1,
      },
      shape: {
        type: "circle",
      },
      opacity: {
        animation: {
          enable: true,
          speed: 0.5,
          startValue: "random",
        },
        value: 1,
      },
      size: {
        value: {
          min: 1,
          max: 3,
        },
        animation: {
          enable: true,
          speed: 3,
          startValue: "random",
        },
      },
      move: {
        enable: true,
        speed: 1,
      },
    },
    poisson: {
      enable: true,
    },
  };

  const resetState = () => {
    setUser({
      id: "",
      name: "",
      email: "",
      entries: 0,
      joined: "",
    });
    setBox(null);
    setIsSignedIn(false);
    setImageUrl("");
    setRoute("signin");
    setInput("");
  };

  const loadUser = (data: User) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    });
  };

  const calculateFaceLocation = (data: any) => {
    const clarifaiFace = data.data.regionsList;
    const image = document.getElementById("inputimage") as HTMLImageElement;
    const width = Number(image.width);
    const height = Number(image.height);
    return clarifaiFace.map((region: any) => {
      const { leftCol, topRow, rightCol, bottomRow } =
        region.regionInfo.boundingBox;

      return {
        leftCol: leftCol * width,
        topRow: topRow * height,
        rightCol: width - rightCol * width,
        bottomRow: height - bottomRow * height,
      };
    });
  };

  const onButtonSubmit = () => {
    setImageUrl(input);

    fetch("http://ec2-35-173-242-114.compute-1.amazonaws.com:5008/imageUrl", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: input,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        if (response.status.description === "Ok") {
          fetch(
            "http://ec2-35-173-242-114.compute-1.amazonaws.com:5008/image",
            {
              method: "PUT",
              mode: "cors",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: user.id,
              }),
            }
          )
            .then((response) => response.json())
            .then((count) => {
              setUser({ ...user, entries: count });
            });
        }
        setBox(calculateFaceLocation(response));
      })
      .catch((err) => console.log(err));
  };

  const onRouteChange = (route: string) => {
    if (route === "signout") {
      resetState();
      route = "signin";
    } else if (route === "home") {
      setIsSignedIn(true);
    }
    setRoute(route);
  };

  return (
    <div className="App">
      {init && <Particles className="particles" options={particlesOptions} />}
      <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} />
      {route === "home" ? (
        <div>
          <Logo />
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm
            onInputChange={setInput}
            onButtonSubmit={onButtonSubmit}
          />
          <FaceRecognition box={box} imageUrl={imageUrl} />
        </div>
      ) : route === "signin" ? (
        <Signin onRouteChange={onRouteChange} loadUser={loadUser} />
      ) : (
        <Register onRouteChange={onRouteChange} loadUser={loadUser} />
      )}
    </div>
  );
};

export default App;
