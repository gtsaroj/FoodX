import React from "react";
import { createPortal } from "react-dom";

const ReactPortal = ({
  children,
  wrapperId = "react-portal",
}: {
  children: React.ReactNode;
  wrapperId?: string;
}) => {
  return createPortal(children, document.body, wrapperId);
};

export default ReactPortal;
