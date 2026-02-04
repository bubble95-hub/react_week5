import { Link, NavLink, Outlet } from "react-router";

function FrontendLayout() {
  const navLinkClass = ({ isActive }) => `nav-link ${isActive ? "active" : ""}`;
  return (
    <>
      <header>
        <ul className="nav">
          <li className="nav-item">
            <NavLink className={navLinkClass} to="/">
              首頁
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={navLinkClass} to="/product">
              產品列表
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={navLinkClass} to="/cart">
              購物車
            </NavLink>
          </li>
        </ul>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="mt-5 text-center">
        <p>© 2026 Bubble</p>
      </footer>
    </>
  );
}
export default FrontendLayout;
