import { useContext } from "react";

import { GlobalLibraryContext } from "../context/GlobalLibraryContext";

export default function useGlobalLibrary() {
  const context = useContext(GlobalLibraryContext);

  if (!context) {
    throw new Error(
      "useGlobalLibrary must be used inside GlobalLibraryProvider.",
    );
  }

  return context;
}
