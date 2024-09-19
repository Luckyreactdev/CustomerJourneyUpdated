import React from "react";
import { components } from "react-select";
import { Button } from "react-bootstrap";

// Custom MenuList Component
const CustomMenuList = (props) => {
  const { children, selectProps } = props;
  const { fetchMoreKeywords, tcFormData, loadingMore } = selectProps;

  return (
    <components.MenuList {...props}>
      {children}
      {tcFormData.next && (
        <div style={{ textAlign: "center", padding: "10px" }}>
          <Button
            variant="link"
            onClick={fetchMoreKeywords}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </components.MenuList>
  );
};

export default CustomMenuList;
