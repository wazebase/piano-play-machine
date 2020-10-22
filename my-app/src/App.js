import React, { useState, useEffect } from 'react';
import './App.css';
import './pianoStyle.css'
import './style.css';
import { useSpring, animated } from "react-spring";
import * as Tone from 'tone';

function App() {
  const major = [0, 2, 4, 5, 7, 9, 11, 12];
  const minor = [0, 2, 3, 5, 7, 8, 10, 12];
  const lydian = [0, 2, 4, 6, 7, 9, 11, 12];
  const mixolydian = [0, 2, 4, 5, 7, 9, 10, 12];

  let pianoKeys = [
    { "C3": { "keyboard": "`" } },
    { "C#3": { "keyboard": "1" } },
    { "D3": { "keyboard": "2" } },
    { "D#3": { "keyboard": "3" } },
    { "E3": { "keyboard": "4" } },
    { "F3": { "keyboard": "5" } },
    { "F#3": { "keyboard": "6" } },
    { "G3": { "keyboard": "7" } },
    { "G#3": { "keyboard": "8" } },
    { "A3": { "keyboard": "9" } },
    { "A#3": { "keyboard": "0" } },
    { "B3": { "keyboard": "-" } },
    { "C4": { "keyboard": "=" } },
    { "C#4": { "keyboard": "q" } },
    { "D4": { "keyboard": "w" } },
    { "D#4": { "keyboard": "e" } },
    { "E4": { "keyboard": "r" } },
    { "F4": { "keyboard": "t" } },
    { "F#4": { "keyboard": "y" } },
    { "G4": { "keyboard": "u" } },
    { "G#4": { "keyboard": "i" } },
    { "A4": { "keyboard": "o" } },
    { "A#4": { "keyboard": "p" } },
    { "B4": { "keyboard": "[" } },
    { "C5": { "keyboard": "]" } }];

  const keyboardArray = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
    "[", "]", "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="];
  let keys = [];
  const [currentKey, setCurrentKey] = useState(null);
  const [currentKeys,setCurrentKeys] = useState(pianoKeys);
  const [scaleType, setScaleType] = useState("major");
  const [scaleMode, setScaleMode] = useState(false);
  const [playMode, setPlayMode] = useState(false);
  const [showSelect, setShowSelect] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [toggle, setToggle] = useState(false);
  const [invisible, setInvisible] = useState(false);
  const [currentScale, setCurrentScale] = useState(null);
  const [bpm,setBpm] = useState(80);
  const [isLooped,setIsLooped] = useState(false);

  const synth= new Tone.PolySynth(Tone.Synth).toDestination();
  const kick = new Tone.MembraneSynth().toDestination();
  const drums = new Tone.Sampler({
    urls: {
    "C3":"https://raw.githubusercontent.com/wazebase/drum-machine/master/01%20HHclosed08.wav",
    "D3":"https://raw.githubusercontent.com/wazebase/drum-machine/master/2Pac%20Snare3.wav",
    },
    release: 1
  }).toDestination();
  const hat = new Tone.Player( "https://raw.githubusercontent.com/wazebase/drum-machine/master/01%20HHclosed08.wav").toDestination();
  const snare = new Tone.Player("https://raw.githubusercontent.com/wazebase/drum-machine/master/2Pac%20Snare3.wav").toDestination();
  useEffect(() => {
    console.log(currentKey);
    if (!keys.includes(currentKey) || !scaleMode) {
      return () => undefined;
    }
    let scale = [];
    let scaleAlgorythm = [];
    let startKey = currentKey.slice(0, -1) + "3";
    let newKeys = keys.slice(keys.indexOf(startKey));
    if (scaleType === "major") {
      scaleAlgorythm = major;
    }
    else if (scaleType === "minor") {
      scaleAlgorythm = minor;
    }
    else if (scaleType === "lydian") {
      scaleAlgorythm = lydian;
    }
    else if (scaleType === "mixolydian") {
      scaleAlgorythm = mixolydian;
    }
    scaleAlgorythm.forEach(i => scale.push(newKeys[i]));
    setCurrentScale(scale);


    return () => currentScale;
  }, [currentKey, scaleType])


  useEffect(() => {
    if (!playMode) {
      window.addEventListener('keydown', handleKeyDown);
    }
    // cleanup this component
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [playMode]);

  useEffect(() => {
    setCurrentKey(null);

  }, [playMode, scaleMode])
  const handleKeyDown = (event) => {
    let note;
    if (keyboardArray.includes(event.key)) {
      pianoKeys.map(currentKey => {
        let keyName = Object.keys(currentKey)[0];
        let keyboardKey = currentKey[keyName]["keyboard"];
        if (keyboardKey === event.key) {
          note = keyName;
          return note;
        }
      });

    }
    setCurrentKey(note);
    synth.triggerAttackRelease(note, "6n")
  };

  let duration = 800;

  let margin = -80;
  let delay = 400;
  let piano = currentKeys.map((currentKey) => {
    let keyName = Object.keys(currentKey)[0];
    keys.push(keyName);
    let keyboardKey = currentKey[keyName]["keyboard"];

    let keyType;
    delay += 50;
    duration -= 15;
    margin += 2;

    if (keyName.length > 2) {
      keyType = "black-key";
    }
    else {
      keyType = "white-key";
    }
    return (

      <Key keyType={keyType} duration={duration} synth={synth} bpm={bpm} setCurrentKey={setCurrentKey}
        keyboardKey={keyboardKey} pianoKey={keyName} margin={margin} delay={delay} toggle={toggle} />

    )
  });


  const slider = (
    <Slider setBpm = {setBpm} bpm ={bpm} isLooped={isLooped}/>
  );

  const scaleToolBar = (
    <ScaleModeToolbar showSelect={showSelect}
      setShowSelect={setShowSelect} setScaleMode={setScaleMode} setPlayMode={setPlayMode}
      setScaleType={setScaleType} currentScale={currentScale} synth={synth} slider = {slider}
      scaleMode={scaleMode} playMode={playMode} currentKey={currentKey}  bpm ={bpm}/>
  );

  const select = (
    <Select setScaleMode={setScaleMode} setPlayMode={setPlayMode} 
      setShowSelect={setShowSelect} setScaleMode={setScaleMode} setPlayMode={setPlayMode}
      scaleMode={scaleMode} playMode={playMode} />
  );

  const playToolBar = (
    <PlayModeToolbar showSelect={showSelect} synth={synth} currentKey={currentKey} keys={keys} kick = {kick}
     snare={snare} hat={hat} drums = {drums}
     setShowSelect={setShowSelect} slider ={slider} setIsLooped = {setIsLooped} bpm ={bpm}/>
  );
  const backButton = (
    <BackButton setScaleMode={setScaleMode} setPlayMode={setPlayMode}
      setShowSelect={setShowSelect} setShowInfo={setShowInfo}
      invisible={invisible}
      setInvisible={setInvisible}
      scaleMode={scaleMode} playMode={playMode} showSelect={showSelect} showInfo={showInfo} />
  );
 
  
  return (
    <div>
      <Piano pianoBoard={piano} scaleModeToolbar={scaleToolBar}
        playModeToolbar={playToolBar}
        showInfo={showInfo}
        setShowInfo={setShowInfo}
        backButton={backButton}
        select={select}
        toggle={toggle}
        invisible={invisible}
        setInvisible={setInvisible}
        setToggle={setToggle} scaleMode={scaleMode}
        showSelect={showSelect} />
    </div>
    
  );
}

const Piano = (props) => {
  const appear = useSpring(props.showInfo ? { opacity: 1, height: "100%", from: { opacity: 0 }, config: { duration: 2000 } } :
    { opacity: 0, config: { mass: 1, tension: 120, friction: 14, duration: 500 } });
  const toolbarAppear = useSpring(!props.showInfo ? { opacity: 1, from: { opacity: 0 }, config: { duration: 1000 }, delay: 2000 } : { opacity: 0 })

  const handleSetPiano = () => {
    props.setShowInfo(false);
    props.setToggle(true);
  }
  useEffect(() => {
    if (props.showInfo === false) {
      setTimeout(() => {
        props.setInvisible(true);
      }, 500)

    }
  }, [props.invisible, props.showInfo])
  return (
    <div id="container">

      {!props.invisible ? (<>
        <animated.div id="info" style={appear}>
          <h1>Welcome to my Piano Scale Project!</h1>
          <p>Click the button below to make piano appear</p>
          <div id="button-div">
            <button id="create-piano" onClick={handleSetPiano}>Create piano</button>
          </div>
        </animated.div>

      </>) : <animated.div id="display" className="toolbar" style={toolbarAppear}>
          {props.showSelect ? (<>{props.select}</>) :
            props.scaleMode ? (<>
              {props.scaleModeToolbar}
              {props.backButton}
            </>) : (<>
              {props.playModeToolbar}
              {props.backButton}
            </>)};
          </animated.div>}
      <div id="keys">
        {props.pianoBoard}
      </div>
    </div>
  );
}

const Key = (props) => {


  const playKey = () => {
    let note = props.pianoKey;
    props.setCurrentKey(note);
    props.synth.triggerAttackRelease(note, "6n")

  }
  let appearTop = useSpring(props.toggle ? {
    marginTop: 0, opacity: 1, visibility: "visible",
    delay: props.delay, config: { mass: 1, tension: 120, friction: 14, duration: props.duration }
  }
    : { opacity: 0, marginTop: props.margin, visibility: "hidden" });
  let appearBottom = useSpring(props.toggle ? {
    marginTop: 0, opacity: 1, visibility: "visible",
    delay: props.delay, config: { mass: 1, tension: 120, friction: 14, duration: props.duration }
  }
    : { opacity: 0, marginTop: -props.margin, visibility: "hidden" });
  return (
    <animated.div style={props.pianoKey.length > 2 ? appearTop : appearBottom}
      id={props.pianoKey} className={props.keyType} onClick={playKey}>

      <p> {props.pianoKey}</p>
      <p>{props.keyboardKey}</p>
    </animated.div>
  )
}
const Select = (props) => {
  return (
    <div>
      <button id="scale-mode" onClick={() => {
        props.setScaleMode(true);
        props.setPlayMode(false);
        props.setShowSelect(false);
      }
      }>Scale Mode</button>
      <button id="play-mode" onClick={() => {
        props.setScaleMode(false);
        props.setPlayMode(true);
        props.setShowSelect(false);
      }}
      >Play Mode</button>
    
     
    </div>
  )
}

const Slider = (props) => {
  return(
  <div class="slidecontainer" id="bpm">
  <input type="range" min="30" max="240" value={props.bpm} class="slider" 
  onChange={(event)=>!props.isLooped?props.setBpm(event.target.value):null}/>
  {props.bpm}
  </div>
  )
}

const ScaleModeToolbar = (props) => {
  const handlePlay = () => {
    const now = Tone.now();
    let addSec = 0;
    props.currentScale.forEach(note => {
      props.synth.triggerAttack(note, now + addSec);
      props.synth.triggerRelease(note, now + addSec +  60/(props.bpm*2));
      addSec += 60/(props.bpm*2);
    })
  }
  return (
    <div>
      <p> Scale Mode</p>
      <div id="key">{props.currentKey}</div>
      <select id="selectScale" onChange={(event) => props.setScaleType(event.target.value)}>
        <option value="major">Major</option>
        <option value="minor">Minor</option>
        <option value="lydian">Lydian</option>
        <option value="mixolydian">Mixolydian</option>
      </select>
      <button id="play" onClick={handlePlay}>Play</button>
      {props.slider}
    </div>
  )
}
const PlayModeToolbar = (props) => {
  const [sequence, setSequence] = useState("");
  const [isPlaying,setIsPlaying] = useState("");
  const [playTime,setPlayTime] = useState(0);
  useEffect(() => {
    if (props.currentKey !== null) {
      setSequence(sequence + props.currentKey + " ");
    }
  }, [props.currentKey])

  const setCorrect = () => {
    let noteArray = sequence.split(" ");
    noteArray = noteArray.filter(note => note!=="")
    let wrongNotes = [];
    let filteredArr = noteArray.filter((key,i) => {
  
      
      if (props.keys.includes(key) || key === "-" || key.includes(",") 
      || key.includes("x") || key.includes("(") || key==="k" || key ==="s" || key==="h") {
        return true;
      }

      else {
        wrongNotes.push(key);
        return false;
      }

    });
    if (filteredArr !== noteArray) {
      console.log("There are no such keys like " + wrongNotes.join(" "));
    }
    setSequence(filteredArr.join(" ") + " ");
  }
  const playSequence = () => {
    let arr;
    
    arr= sequence.split(" ");
    arr = arr.filter(note => note!=="")
    let newArr = [];
    arr.forEach((note,i)=>{
      if(note.includes("x"))
       {
        let startIndex;
        if(note.length === 2) {
          startIndex = 0;
        }
        else if(note.length === 4) {
          startIndex = i - note.slice(-1);
        }
        let part = arr.slice(startIndex,i);
        part = part.filter(item => !item.includes("x"));
        let times = note[1];
        while(times > 1) {
        part.forEach((item,index)=>{
          newArr.push(item);
        });
        times-=1;
      }
      }
      else {
        newArr.push(note);
      }
    })
    const now = Tone.now();
    newArr.forEach((note,i)=> note.includes(",") && !note.includes("(")?newArr[i]=note.split(","):0);
    console.log(newArr);
    let addTime = 0;
    newArr.forEach((note,i) => {
   
      if(newArr[i-1] === "-" || (note === "-" && i===0)) {
        addTime+= 60/(props.bpm*2);
      }
      if(Array.isArray(note)) {
        note.forEach((item)=> {
          props.synth.triggerAttackRelease(item, ( 60/(props.bpm*2))/note.length,now + addTime);
          addTime+= ( 60/(props.bpm*2)) / note.length;     
        })
      }
      else if(note.includes("(") && note.includes(")")) {

        let chord = note.split(",");
        chord = chord.map((key,i)=>key.includes("(")? chord[i] = key.slice(1,3):key.includes(")")? chord[i] = key.slice(0,2):key);
        console.log(chord);
        props.synth.triggerAttackRelease(chord, 60/(props.bpm*2),now + addTime);
        addTime+=  60/(props.bpm*2);
      }
      else if(props.keys.includes(note)) {
      props.synth.triggerAttackRelease(note, 60/(props.bpm*2),now + addTime);
      addTime+=  60/(props.bpm*2);
      }
      else if(note ==="k" || note==="s" || note==="h") {
        if (note ==="k") {
        props.kick.triggerAttackRelease("C1", 60/(props.bpm*2),now + addTime);
        }
        else if (note ==="s") {
         
           props.drums.triggerAttack("D3",now + addTime);
        
        }
        else {
          props.drums.triggerAttack("C3",now + addTime);
        }
        addTime+=  60/(props.bpm*2);
      }
      if (note === "-" && i === newArr.length-1) {
        addTime+= 60/(props.bpm*2);
      }
    })
   setPlayTime(addTime);
  }
  const handlePlay = () => {
      setCorrect();
      playSequence();
  }

  const handleLoop = () => {

    const loop = new Tone.Loop((time) => {
      playSequence();
    },playTime).start(0);
    Tone.Transport.start();
    props.setIsLooped(true);
    /*setCorrect();
    let arr;
    if(sequence.slice(-1) === " ") {
    arr= sequence.split(" ").slice(0,-1);
    }
    else {
      arr= sequence.split(" ");
    }
    arr.forEach((note,i)=> note.includes(",")?arr[i]=note.split(","):0);
    arr.forEach((note,i)=> note==="-"?arr[i]=null:0);

    const synthPart = new Tone.Sequence(
      function(time, note) {
        props.synth.triggerAttackRelease(note,0.65, time);
      },
      arr,
      0.65
    );

      synthPart.start(0);
    Tone.Transport.start();

    arr.forEach((note,i)=> note===null?arr[i]="-":0);
      */
     setIsPlaying(sequence);
  }
  const handleReset = () => {
    setSequence("");
    setIsPlaying("");
    props.setIsLooped(false);
    Tone.Transport.stop();
    Tone.Transport.cancel(0);
  }
  return (
    <div>
      <p>PlayMode</p>
      <input id="sequence" value={sequence} onChange={(event) => setSequence(event.target.value)}></input>
      <button id="sequence-play" onClick={sequence ===""?null:handlePlay}>Play</button>
      <button id="clear" onClick={handleReset}>Clear</button>
       <button id="addStep" onClick={()=>setSequence(sequence.slice(0,-1)+ ",")}>+1/2time</button>
      <button id="addTime" onClick={()=>setSequence(sequence+ "-" +" ")}>+time</button>
      <button id="loop" onClick={handleLoop}>Loop</button>
      {props.slider}
  <div id="playing-loop">{isPlaying}</div>
    </div>
  );
}
const BackButton = (props) => {
  const handleClick = () => {
    if (props.showInfo) {
      return undefined;
    }
    else if (props.showSelect) {
      props.setShowInfo(true);
      props.setShowSelect(false);
      props.setInvisible(false);
    }
    else if (props.playMode) {
      props.setPlayMode(false);
      props.setShowSelect(true);
    }
    else if (props.scaleMode) {
      props.setScaleMode(false);
      props.setShowSelect(true);
    }
  }

  return (
    <button id="back-button" onClick={handleClick}>Back</button>
  )
}
export default App;
