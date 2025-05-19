
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    
      <div>
     <header></header>
        <main>
        <Outlet />
        </main>  
      <footer><h3>Be happy!!</h3></footer>  
     </div>
  );
};

export default Layout;