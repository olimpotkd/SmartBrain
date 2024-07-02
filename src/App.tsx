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
    const clarifaiFace = data[0].data.regionList;
    const image = document.getElementById("inputimage") as HTMLImageElement;
    const width = Number(image.width);
    const height = Number(image.height);
    return clarifaiFace.map((region: any) => {
      const { left_col, top_row, right_col, bottom_row } =
        region.regionInfo.boundingBox;

      return {
        leftCol: left_col * width,
        topRow: top_row * height,
        rightCol: width - right_col * width,
        bottomRow: height - bottom_row * height,
      };
    });
  };

  const onButtonSubmit = () => {
    setImageUrl(input);

    fetch("https://serene-oasis-80711.herokuapp.com/imageUrl", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: input,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status.description === "Ok") {
          fetch("https://serene-oasis-80711.herokuapp.com/image", {
            method: "PUT",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: user.id,
            }),
          })
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
