import React, { Component } from "react";
import { withRouter } from "react-router";
import PagesList from "./pages-list";

class PagesSidebar extends Component {
  async componentDidMount() {
    const params = { siteUrl: this.props.siteData.siteUrl };

    const fetchUrl = new URL(`${window.location.origin}/api/get-site-status`);
    const siteData = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    }).then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return res.text();
      }
    });

    this.props.setSiteStatus(siteData.siteStatus);
  }

  deleteSite = async () => {
    const params = { sitePath: this.props.siteData.sitePath };
    const fetchUrl = new URL(`${window.location.origin}/api/delete-site`);

    await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    }).then((res) => {
      if (res.status === 200) {
        this.props.history.push("/sites");
      } else {
        console.error(res.text());
      }
    });
  };

  render() {
    const { siteName, siteUrl, siteStatus } = this.props.siteData;

    return (
      <div className="pages-sidebar">
        <div
          className={`pages-sidebar__site-status ${
            siteStatus === "" || !siteStatus
              ? ""
              : siteStatus === "OK"
              ? "pages-sidebar__site-status--ok"
              : "pages-sidebar__site-status--not-ok"
          }`}
        />
        <a href={siteUrl} target="_blank" rel="noreferrer">
          <h1 className="pages-sidebar__site-name">{siteName}</h1>
        </a>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a className="pages-sidebar__delete-site" onClick={this.deleteSite}>
          Delete site
        </a>
        <PagesList {...this.props} />
      </div>
    );
  }
}

export default withRouter(PagesSidebar);