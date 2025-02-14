import SensorStruct from "./components/SensorStruct"

function App() {
  return (
    <>
      <div className="fullStruct">
        <SensorStruct comparaison={true}/>
        <SensorStruct comparaison={false}/>
      </div>
    </>
  )
}

export default App