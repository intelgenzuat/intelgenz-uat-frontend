import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import AdminSidebar from './AdminSidebar';
import { Outlet, useLocation } from 'react-router-dom';
import { mitigationttpview, View, Viewreport, IntelCard, IntelCardDetails, ThreatActorprofile, IntelCardMalware, IntelCardThreatDetails, viewinKnowlegdeGraph, IntelviewinKnowlegdeGraph, BlogsandNews, blogsnewslist } from '../Routes/Routes';

export default function Layout({ noFooter, showAdminSidebar }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const location = useLocation();
  const hideFooterRoutes = [View, Viewreport, mitigationttpview, IntelCard, IntelCardDetails, ThreatActorprofile, IntelCardMalware, IntelCardThreatDetails, viewinKnowlegdeGraph, IntelviewinKnowlegdeGraph];
  const shouldHideFooter = noFooter || hideFooterRoutes.includes(location.pathname);
  
  const isScrollableInner = location.pathname === '/' || location.pathname === BlogsandNews || location.pathname === blogsnewslist;

  return (
    <div className={`d-flex flex-column ${shouldHideFooter || isScrollableInner ? 'vh-100 overflow-hidden' : 'min-vh-100'} bg-body`}>
      <Header toggleSidebar={toggleSidebar} showHamburger={showAdminSidebar || location.pathname === View || location.pathname === mitigationttpview || location.pathname === IntelCard || location.pathname === IntelCardMalware || location.pathname === ThreatActorprofile || location.pathname === viewinKnowlegdeGraph || location.pathname === IntelviewinKnowlegdeGraph} />
      <div className="d-flex flex-grow-1 overflow-hidden">
        {showAdminSidebar && <AdminSidebar collapsed={isSidebarCollapsed} />}
        <div className={`flex-grow-1 d-flex flex-column ${shouldHideFooter ? 'overflow-hidden' : ''} ${isScrollableInner ? 'overflow-y-auto' : ''}`}>
          <Outlet context={{ isSidebarCollapsed, toggleSidebar }} />
          {isScrollableInner && !shouldHideFooter && <Footer />}
        </div>
      </div>
      {!shouldHideFooter && !isScrollableInner && <Footer />}
    </div>
  );
}
