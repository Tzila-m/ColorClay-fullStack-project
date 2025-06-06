import React from 'react';
import { Outlet } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


export default function Layout() {

  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const roles = user?.roles || null;


  const isAdmin = roles === 'admin';


  const userItems = [
    {
      label: 'המוצרים שלנו',
      icon: 'pi pi-tags',
      items: [
        { label: 'צבעים', icon: 'pi pi-palette', command: () => navigate('/color') },
        { label: 'קטגוריות מוצרים', icon: 'pi pi-th-large', command: () => navigate('/category') }
      ]
    },
    {
      label: 'היסטוריית הזמנות',
      icon: 'pi pi-history',
      command: () => navigate('/history')
    },
    {
      label: 'הזמנת שולחן',
      icon: 'pi pi-calendar',
      command: () => navigate('/table')
    },
    {
      label: 'סל קניות',
      icon: 'pi pi-shopping-cart',
      command: () => navigate('/basket')
    }
  ];


  const adminItems = [
    {
      label: 'המוצרים שלנו',
      icon: 'pi pi-tags',
      items: [
        { label: 'צבעים', icon: 'pi pi-palette', command: () => navigate('/color') },
        { label: 'קטגוריות מוצרים', icon: 'pi pi-th-large', command: () => navigate('/category') }
      ]
    },
    {
      label: 'סטטוס הזמנות',
      icon: 'pi pi-list',
      items: [
        { label: 'הזמנות להיום', icon: 'pi pi-calendar', command: () => navigate('/status1') },
        { label: 'הזמנות פעילות', icon: 'pi pi-spin pi-cog', command: () => navigate('/status2') },
        { label: 'הזמנות בטיפול', icon: 'pi pi-exclamation-circle', command: () => navigate('/status3') },
        { label: 'הזמנות שהושלמו', icon: 'pi pi-check-circle', command: () => navigate('/status4') }
      ]
    }

  ];


  const items = isAdmin ? adminItems : userItems;


  const start = (
    <img
      alt="logo"
      src="/pictures/logo.png"
      className="logo"
      style={{ height: '40px' }}
    />
  );


  return (
    <div className="layout-container">
      <header>
        <Menubar model={items} start={start} />
      </header>


      <main>
        <Outlet />
      </main>


      <footer>
        {/* אפשר להוסיף פרטים נוספים כאן */}
      </footer>
    </div>
  );
}






