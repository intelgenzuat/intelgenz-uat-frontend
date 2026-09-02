import React, { useState } from 'react';
import { useOutletContext, Outlet } from 'react-router-dom';
import Voicechatdrawer from '../../components/Drawers/Voicechatdrawer';
import Intelegenzchatdrawer from '../../components/Drawers/Intelegenzchatdrawer';
import FloatingChatButtons from '../../components/Buttons/FloatingChatButtons';
import ThreatActorsidebar from '../../components/sidebars/ThreatActorsidebar';

export default function ThreatActorProfilingPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isVoicechatDrawerOpen, setIsVoicechatDrawerOpen] = useState(false);
  const { isSidebarCollapsed, toggleSidebar } = useOutletContext() || {};

  return (
    <div className="threat-actor-page-container container-fluid p-0 d-flex flex-column h-100 overflow-hidden">
      <div className="d-flex flex-grow-1 overflow-hidden" style={{ minHeight: 0 }}>

        {/* Fixed Sidebar Container */}
        <div className="flex-shrink-0 h-100 overflow-hidden">
          <ThreatActorsidebar
            collapsed={isSidebarCollapsed}
            toggled={!isSidebarCollapsed && window.innerWidth < 992}
            onBackdropClick={toggleSidebar}
          />
        </div>

        {/* Scrollable Main Content (Outlet only) */}
        <div className="d-flex flex-column flex-grow-1 overflow-y-auto" style={{ minHeight: 0 }}>
          <Outlet />
        </div>

        {/* Floating Chat Button (Bottom-Right) */}
        <FloatingChatButtons
          onIntelgenzOpen={() => setIsDrawerOpen(true)}
        />

        {/* Drawer components */}
        <Voicechatdrawer
          isOpen={isVoicechatDrawerOpen}
          onClose={() => setIsVoicechatDrawerOpen(false)}
          onEnableTextChat={() => {
            setIsVoicechatDrawerOpen(false);
            setIsDrawerOpen(true);
          }}
        />
        <Intelegenzchatdrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onEnableVoiceChat={() => {
            setIsDrawerOpen(false);
            setIsVoicechatDrawerOpen(true);
          }}
        />
      </div>
    </div>
  );
}
