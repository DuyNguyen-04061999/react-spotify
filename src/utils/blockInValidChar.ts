import React from "react";
export const blockInvalidChar = (
  e: React.KeyboardEvent<HTMLInputElement>
): false | void =>
  ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault();
