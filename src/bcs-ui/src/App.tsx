import { Layout, Grid } from "antd";
import { Outlet } from "react-router";
import Sidebar from "./components/Sidebar";

const { Content } = Layout;

const App: React.FC = () => {
  const screen = Grid.useBreakpoint();
  const padding = screen.md ? 10 : 50;

  return (
    <Layout>
      <Sidebar />
      <Layout>
        <Content style={{ paddingLeft: '10px', paddingTop: `${padding}px` }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
