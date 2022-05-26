import List from './components/List'
import Map from './components/Map'

import apps from './data/NeRelog_apps.json'
import clients from './data/NeRelog_clients.json'

function App() {
  const appsMapped = apps.map((item,i)=>{item.index = i;return item})
  const clientsIdMapping = clients.reduce((acc, item) =>{
      acc[item.id] = item.name
      return acc
  },{})
  return (
    <div className="App">
      <List apps={appsMapped} clients={clients} clientsIdMapping={clientsIdMapping}/>
      <Map apps={appsMapped} clients={clients} clientsIdMapping={clientsIdMapping}/>
    </div>
  );
}

export default App;
