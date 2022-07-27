import { createContext, useContext } from "react";
import { useState } from "react";
const ContextSize = createContext();

export function SizeWrapper({ children }) {
  const [resolution, setResolution] = useState("");
  const handleSizeChange = (event) => {
    setResolution(event.target.value);
  };
  const values = {resolution, handleSizeChange}
  return (
    <ContextSize.Provider
      value={values}
    >
      {children}
    </ContextSize.Provider>
  );
}
export function GetContextSize (){
    return useContext(ContextSize)
}
