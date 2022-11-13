import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  useMemo
} from "react";
import moment from "moment-timezone";

// Date and time component
const Time = (props) => {
  useEffect(() => {
    const showTime = setInterval(() => {
      document.getElementById("time").innerHTML = moment().format(
        "dddd · MMMM D yyyy · h:mm:ss A"
      );
    }, 1000);
    return () => clearInterval(showTime);
  }, [props.input]);

  return <div id="time"></div>;
};

// Array component
const Array = () => {
  const [array, setArray] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts/")
      .then((response) => response.json())
      .then((json) => setArray(json));
  }, []);

  // Since the json returns a long list I am using useMemo so we don't needlessly re-render the list
  const memoData = useMemo(() => array, [array]);

  return (
    <ul>
      {memoData.map((post, i) => (
        <li key={i}>{post.title}</li>
      ))}
    </ul>
  );
};

const DynamicComponent = () => {
  const { input } = useContext(AppContext);

  return (
    <div>
      <h2>Output:</h2>
      {input === "Falsy" ? (
        <>
          <p>
            If the 'input' prop is falsy - show live-updating date and time:
          </p>
          <Time />
        </>
      ) : input === "Array" ? (
        <>
          <p>If the 'input' prop is an array - show the array elements:</p>
          <Array />
        </>
      ) : (
        <>
          <p>If the 'input' prop is anything else - show a value:</p>
          {input}
        </>
      )}
    </div>
  );
};

const RadioButton = (props) => {
  return (
    <>
      <input
        type="radio"
        name={props.name ? props.name : "props"}
        id={props.value}
        // If the component has a `name` prop - set the value for `selectedBoolean`, if not - set the value for `selected`
        onClick={
          props.name
            ? () => props.setSelectedBoolean(props.value)
            : () => props.setSelected(props.value)
        }
      />
      <label htmlFor={props.value}>{props.value}</label>
    </>
  );
};

const RadioButtons = () => {
  const { selected, setSelected, setSelectedBoolean } = useContext(AppContext);

  return (
    <div>
      <h1>Toggle 'input' prop:</h1>
      <ul>
        <li>
          <RadioButton
            value="Boolean"
            setSelected={setSelected}
            setSelectedBoolean={setSelectedBoolean}
          />
          {selected === "Boolean" && (
            <ul>
              <li>
                <RadioButton
                  value="True"
                  name="boolean"
                  setSelected={setSelected}
                  setSelectedBoolean={setSelectedBoolean}
                />
              </li>
              <li>
                <RadioButton
                  value="False"
                  name="boolean"
                  setSelected={setSelected}
                  setSelectedBoolean={setSelectedBoolean}
                />
              </li>
            </ul>
          )}
        </li>
        <li>
          <RadioButton
            value="Array"
            setSelected={setSelected}
            setSelectedBoolean={setSelectedBoolean}
          />
        </li>
      </ul>
    </div>
  );
};

export const AppContext = createContext(null);

export default function App() {
  const [selected, setSelected] = useState(null);
  const [selectedBoolean, setSelectedBoolean] = useState(null);
  const [input, setInput] = useState(null);

  // On `selected` and `selectedBoolean` run the following statements:
  useEffect(() => {
    // If `Boolean` is sleceted with and the selected boolean is `False` set input to `Falsy`
    if (selected === "Boolean" && selectedBoolean === "False") {
      setInput("Falsy");
      // If `Array` is selected set input to `Array` and clear the `selectedBoolean` state
    } else if (selected === "Array") {
      setInput("Array");
      setSelectedBoolean(null);
      // If nothing is selected or if `Boolean` is selected but `False is not` set input to `Some value...`
    } else if (
      (!selected && !selectedBoolean) ||
      (selected === "Boolean" && selectedBoolean !== "False")
    ) {
      setInput("Some value...");
    } else {
      setInput("");
    }
  }, [selected, selectedBoolean]);

  return (
    <div className="App">
      <AppContext.Provider
        value={{
          selected,
          setSelected,
          selectedBoolean,
          setSelectedBoolean,
          input,
          setInput
        }}
      >
        <RadioButtons />
        <DynamicComponent />
      </AppContext.Provider>
    </div>
  );
}
