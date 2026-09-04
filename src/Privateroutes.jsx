import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Layout from './layout/Layout'
import {
    Home,
    View,
    Viewreport,
    mitigationttpview,
    Malwaremitigationttpview,
    IntelCard,
    IntelCardDetails,
    ThreatActorprofile,
    IntelCardMalware,
    IntelCardThreatDetails,
    BlogsandNews,
    EmergingThreatReport,
    blogsnewslist,
    blogsnewsadd,
    blogsnewsedit,
    viewinKnowlegdeGraph,
    IntelviewinKnowlegdeGraph,
} from './Routes/Routes';


import AdminLayout from './layout/AdminLayout';

// Lazy load all components
const Homepage = lazy(() => import('./pages/Homepage/Homepage'));
const Dashboardpage = lazy(() => import('./pages/Admindashboard/dashboard/Dashboardpage'));
const BlogsnewsList = lazy(() => import('./pages/Admindashboard/blogsnews/BlogsnewsList'));
const Viewpage = lazy(() => import('./pages/Viewpages/View'))
const Viewreportpage = lazy(() => import('./pages/Viewpages/ViewReport'))
const Notfoundpage = lazy(() => import('./common/404/Pagenotfound'))
const IntelCardLayout = lazy(() => import('./pages/IntelCard/IntelCardPage'))
const Mitigationttpview = lazy(() => import('./pages/Mitigationttpview/Mitigationttpview'));
const Malwarettpview = lazy(() => import('./pages/Mitigationttpview/malwarettp/Malwarettpview'));
const IntelCardDetailsView = lazy(() => import('./pages/IntelCard/IntelCardDetailview'));
const ThreatActorProfilingLayout = lazy(() => import('./pages/ThreatActorProfiling/ThreatActorProfilingPage'));
const ThreatActorProfilingTable = lazy(() => import('./pages/ThreatActorProfiling/ThreatActorProfilingTable'));
const IntelCardsGrid = lazy(() => import('./pages/IntelCard/IntelCards'));
const IntelCardMalwareGrid = lazy(() => import('./pages/IntelCard/IntelCardMalware'));
const IntelCardThreatActorDetail = lazy(() => import('./pages/IntelCard/IntelCardThreatActorDetail'));
const BlogsandNewsPage = lazy(() => import('./pages/Blogsandnews/BlogsandNewsPage'));
const EmergingThreatReportpage = lazy(() => import('./pages/Viewpages/ReportPage/EmergingThreatReportpage'));
const BlogsnewsEditpage = lazy(() => import('./pages/Admindashboard/blogsnews/BlogsnewsEdit'));
const ViewinKnowledgegrap = lazy(() => import('./pages/ThreatActorProfiling/ViewInKnowledgeGraph/ViewInKnowledegeGraph'));
const IntelviewinKnowlegdeGraphpage = lazy(() => import('./pages/IntelCard/knowledgeGraph/intelKnowledegeGraph'));
const IntelcardThreatActorDetailNew = lazy(() => import('./pages/IntelCard/intelcardThreatActorDetailNew'));
const IntelcardMalwareDetailNew = lazy(() => import('./pages/IntelCard/intelcardMalwareDetailNew'));


// Guard: only Admin role can access admin routes
const AdminRoute = ({ children }) => {
    const role = localStorage.getItem('role');
    return role === 'Admin' ? children : <Navigate to="/" replace />;
};

const Privateroutes = () => {
    const navigate = useNavigate();

    const [isLogged, setIsLogged] = useState(false);
    const role = localStorage.getItem('role');

    useEffect(() => {
        const logged = localStorage.getItem('is_logged');
        if (!logged && window.location.pathname !== '/login') {
            setIsLogged(false);
            navigate('/login');
        } else {
            setIsLogged(true);
        }
    }, []);


    return (
        <div>
            <Suspense fallback={<div className="d-flex justify-content-center align-items-center vh-100 vw-100" ></div>}>
                <Routes>
                    <Route exact path="/" element={role === 'Admin' ? <AdminLayout /> : <Layout />}>
                        <Route exact path={Home} element={role === 'Admin' ? <Dashboardpage /> : <Homepage />}></Route>
                        <Route exact path={View} element={<Viewpage noFooter />}></Route>
                        <Route exact path={Viewreport} element={<Viewreportpage noFooter />}></Route>
                        <Route exact path={mitigationttpview} element={<Mitigationttpview noFooter />}></Route>
                        <Route exact path={Malwaremitigationttpview} element={<Malwarettpview noFooter />}></Route>
                        <Route element={<IntelCardLayout noFooter />}>
                            <Route exact path={IntelCard} element={<IntelCardsGrid noFooter />}></Route>
                            <Route exact path={IntelCardMalware} element={<IntelCardMalwareGrid noFooter />}></Route>
                            <Route exact path={IntelviewinKnowlegdeGraph} element={<IntelviewinKnowlegdeGraphpage noFooter />}></Route>
                        </Route>
                        <Route element={<ThreatActorProfilingLayout noFooter />}>
                            <Route exact path={ThreatActorprofile} element={<ThreatActorProfilingTable noFooter />}></Route>
                            <Route exact path={viewinKnowlegdeGraph} element={<ViewinKnowledgegrap noFooter />}></Route>
                        </Route>
                        <Route exact path={IntelCardDetails} element={<IntelcardMalwareDetailNew noFooter />}></Route>
                        <Route exact path={IntelCardThreatDetails} element={<IntelcardThreatActorDetailNew noFooter />}></Route>
                        <Route exact path={BlogsandNews} element={<BlogsandNewsPage noFooter />}></Route>
                        <Route exact path={blogsnewslist} element={<AdminRoute><BlogsnewsList noFooter /></AdminRoute>}></Route>
                        <Route exact path={blogsnewsedit} element={<AdminRoute><BlogsnewsEditpage noFooter /></AdminRoute>}></Route>
                        <Route exact path={blogsnewsadd} element={<AdminRoute><BlogsnewsEditpage noFooter /></AdminRoute>}></Route>
                    </Route>
                    <Route exact path={EmergingThreatReport} element={<EmergingThreatReportpage />}></Route>
                    <Route exact path="*" element={<Notfoundpage />}></Route>
                </Routes>
            </Suspense>
        </div>
    )
}

export default Privateroutes
