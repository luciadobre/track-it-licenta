import Button from "../@atoms/Button";
import { dashboardNavItems } from "./navItems";

const Sidebar = () => {
  return (
      <aside className="sticky top-0 hidden h-screen w-56 border-r border-border bg-primary-dark p-4 md:block">
        <div className="mb-8 text-lg font-semibold">Trackit</div>
        <ul className="space-y-1">
          {dashboardNavItems.map((item) => (
            <li key={item.path}>
              <Button
                intent="primary-light"
                animation="hoverAnimation-light"
                size="md"
                text={item.label}
                redirectPath={item.path}
              />
            </li>
          ))}
        </ul>
      </aside>
  );
};

export default Sidebar;
