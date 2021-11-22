import React, { Component } from "react";
import { Collapse } from "antd";
import AboutSite from "./about-site";
import SiteConfig from "./site-config";

const { Panel } = Collapse;

class OptionsSidebar extends Component {
  render() {
    return (
      <Collapse defaultActiveKey={["0", "1"]} className="sidebar__accordion">
        <Panel key={0} header="About site" id="about-site">
          <AboutSite {...this.props} />
        </Panel>
        <Panel key={1} header="Site config" id="site-config">
          <SiteConfig {...this.props} />
        </Panel>
      </Collapse>
    );
  }
}

export default OptionsSidebar;
