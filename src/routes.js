import React from 'react'

const configs = React.lazy(() => import('./views/others/configs'))
const encryption = React.lazy(() => import('./views/others/encryptions/encrypt'))
const dataservicePerms = React.lazy(() => import('./views/others/rules/dataservice/dataservice'))
const publisherervicePerms = React.lazy(() => import('./views/others/rules/publisher/publisherService'))
const ossPerms = React.lazy(() => import('./views/others/rules/oss/osService'))
const recomPerms = React.lazy(() => import('./views/others/rules/recommendation/recommendation'))
const applications = React.lazy(() => import('./views/others/applications'))

const routes = [
  { path: '/configs', name: 'Configurations', component: configs },
  { path: '/encryption', name: 'Encryptions', component: encryption },
  { path: '/applications', name: 'Applications', component: applications },
  { path: '/perms/dataservice', name: 'Data Service Permissions', component: dataservicePerms },
  { path: '/perms/publisher', name: 'Publisher Service Permissions', component: publisherervicePerms },
  { path: '/perms/oss', name: 'Object Storage Service Permissions', component: ossPerms },
  { path: '/perms/recommendation', name: 'Recommendation Service Permissions', component: recomPerms }

]

export default routes
