import { ReactNode } from "react";

type ConditionalWrapperProps = {
  condition: boolean;
  wrapper: (children: ReactNode) => ReactNode;
  children: ReactNode;
};

export const ConditionalWrapper = ({
  condition,
  wrapper,
  children,
}: ConditionalWrapperProps) => (condition ? wrapper(children) : children);
