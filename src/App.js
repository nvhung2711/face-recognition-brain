import React, {useState} from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import ParticlesBg from 'particles-bg';
import './App.css';

function App() {
  const [input, setInput] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [box, setBox] = useState([]);
  const [route, setRoute] = useState('signin');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({
    id: '',
    email: '',
    name: '',
    entries: 0,
    joined: ''
  });

  const resetState = () => {
    setInput(null);
    setImageUrl(null);
    setBox([]);
    setRoute('signin');
    setIsSignedIn(false);
    setUser({
      id: '',
      email: '',
      name: '',
      entries: 0,
      joined: ''
    });
  }

  const calculateFaceLocation = (data) => {
    const clarifaiFaces = data.outputs[0].data.regions;

    const faceBoxes = clarifaiFaces.map((data) => {
      const clarifaiFace = data.region_info.bounding_box;
      const image = document.getElementById('inputImage');
      const width = Number(image.width);
      const height = Number(image.height);
      
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      };
    })
    
    return faceBoxes;
  }

  const displayFaceBox = (box) => {
    setBox(box);
  }

  const onInputChange = (event) => {
    setInput(event.target.value);
  }

  const onPictureSubmit = () => {
    setImageUrl(input);

    if(input) {
      fetch('http://localhost:3001/image', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          id: user.id,
          input: input
        })
      })
      .then(response => response.json())
      .then(response => {
        if(response.entries && response.result) {
          loadUser(Object.assign(user, {entries: response.entries}));
          displayFaceBox(calculateFaceLocation(response.result));
        }
      })
      .catch(err => console.log(err));
    }
  }

  const onRouteChange = (route) => {
    if(route === 'home') {
      setIsSignedIn(true)
    } else {
      setIsSignedIn(false);
    }
    if(route === 'signout') {
      console.log('reset called');
      resetState();
    }
    setRoute(route);
  }

  const loadUser = (data) => {
    setUser({
      id: data.id,
      email: data.email,
      name: data.name,
      entries: data.entries,
      joined: data.joined
    });
  }

  return (
    <div className="App">
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange}/>
      {route === 'home' ? 
        <div>
          <Logo/>
          <Rank name={user.name} entries={user.entries}/>
          <ImageLinkForm onInputChange={onInputChange} onClick={onPictureSubmit}/>
          <FaceRecognition imageUrl={imageUrl} box={box}/>
        </div>
        :
        (route === 'signin' || route === 'signout') ?
        <SignIn onRouteChange={onRouteChange} loadUser={loadUser}/> 
        :
        <Register onRouteChange={onRouteChange} loadUser={loadUser}/>
      }
      <ParticlesBg color="#ffffff" num={300} type="cobweb" bg={true} />
    </div>
  );
}

export default App;
