import React from "react";
import BooksListing from "./Books/BooksListing";
import AuthorListing from "./Authors/AuthorsListing";
import LibraryListing from "./Library/LibraryListing";

class Main extends React.PureComponent {
  state = {
    currentComponent: "books",
  };

  renderComponent = (component) => {
    switch (component) {
      case "books":
        return <BooksListing />;
      case "authors":
        return <AuthorListing />;
      case "library":
        return <LibraryListing />;
      default:
        return <></>;
    }
  };

  render() { 
    const { currentComponent } = this.state;

    return (
      <div className={`MainWrapper`}>
        <div className={`Body`}>
          <div className={`SideBar`}>

            <div
              className={
                currentComponent === "books"
                  ? `sidebarListActive`
                  : `sidebarList`
              }
              onClick={() => {
                this.setState({ currentComponent: "books" });
              }}
            >
              Books
            </div>

            <div
              className={
                currentComponent === "authors"
                  ? `sidebarListActive`
                  : `sidebarList`
              }
              onClick={() => {
                this.setState({ currentComponent: "authors" });
              }}
            >
              Authors
            </div>

            <div
              className={
                currentComponent === "library"
                  ? `sidebarListActive`
                  : `sidebarList`
              }
              onClick={() => {
                this.setState({ currentComponent: "library" });
              }}
            >
              Library
            </div>
          </div>

          <div className={`Components`}>
            <div style={{ margin: "5rem" }}>
              {this.renderComponent(currentComponent)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
