const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  listLoading: state => state.app.listLoading,
  loadingAll: state => state.app.loadingAll,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  orgName: state => state.user.orgName,
  roles: state => state.user.roles,
  userInfo: state => state.user.userInfo,
  permission_routes: state => state.permission.routes,
  permissionButtons: state => state.permission.permissionButtons,
  errorLogs: state => state.errorLog.logs
}
export default getters
