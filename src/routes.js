/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { lazy } from 'react';
import { Redirect } from 'react-router-dom';
import AuthLayout from './layouts/Auth';
import ErrorLayout from './layouts/Error';
import DashboardLayout from './layouts/Dashboard';
import SimpleDashboardLayout from './layouts/SimpleDashboard';
import BlankLayout from './layouts/BlankLayout';
import HomeView from './views/Home';

export default [
  {
    path: '/',
    exact: true,
    component: () => <Redirect to="/home" />
  },
  {
    path: '/home',
    component: BlankLayout,
    routes: [
      {
        path: '/home',
        exact: true,
        component: lazy(() => import('src/views/Home'))
      }
    ]
  },
  {
    path: '/dashboard',
    component: SimpleDashboardLayout,
    routes: [
      {
        path: '/dashboard',
        exact: true,
        component: lazy(() => import('src/views/Dashboard'))
      }
    ]
  },
  {
    path: '/build',
    component: SimpleDashboardLayout,
    routes: [
      {
        path: '/build',
        exact: true,
        component: lazy(() => import('src/views/New'))
      },
      {
        path: '/build/:id',
        exact: true,
        component: lazy(() => import('src/views/PresentationBuilder'))
      },
      {
        path: '/build/:id/:tab',
        exact: true,
        component: lazy(() => import('src/views/PresentationBuilder'))
      }
    ]
  },
  {
    path: '/errors',
    component: ErrorLayout,
    routes: [
      {
        path: '/errors/error-401',
        exact: true,
        component: lazy(() => import('src/views/Error401'))
      },
      {
        path: '/errors/error-404',
        exact: true,
        component: lazy(() => import('src/views/Error404'))
      },
      {
        path: '/errors/error-500',
        exact: true,
        component: lazy(() => import('src/views/Error500'))
      },
      {
        component: () => <Redirect to="/errors/error-404" />
      }
    ]
  }
];
