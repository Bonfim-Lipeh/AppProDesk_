import {useApp} from './store.js';import Auth from './screens/Auth.jsx';import Explore from './screens/Explore.jsx';import Detail from './screens/Detail.jsx';import Booking from './screens/Booking.jsx';import Confirm from './screens/Confirm.jsx';import Mine from './screens/Mine.jsx';import Profile from './screens/Profile.jsx';
export default function App(){const{user,screen,draft,spaceId,lastId}=useApp();let v;
 if(!user)v=<Auth key={screen} mode={screen==='signup'?'signup':'login'}/>;
 else if(screen==='detail'&&spaceId)v=<Detail key={spaceId}/>;
 else if(screen==='book'&&draft)v=<Booking key={draft.spaceId}/>;
 else if(screen==='confirm'&&lastId)v=<Confirm/>;
 else if(screen==='mine')v=<Mine/>;else if(screen==='profile')v=<Profile/>;else v=<Explore/>;
 return<div className="app">{v}</div>}
