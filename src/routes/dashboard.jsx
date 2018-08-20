// import DeleteUser from "../views/User/DeleteUser";
import Home from "../views/Home/Home";

const dashboardRoutes = [
  {
    display: 'Creator, Admin, Executor, Approver',
    path: "/home",
    name: "Home",
    icon: "pe-7s-graph",
    component: Home
  },
  // auth
  { redirect: true, path: "/", to: "/home", name: "Home" }
];

export default dashboardRoutes;
