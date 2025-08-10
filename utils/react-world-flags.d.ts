declare module "react-world-flags" {
  import { ComponentType, HTMLAttributes } from "react";

  interface FlagProps extends HTMLAttributes<HTMLDivElement> {
    code: string;
    style?: React.CSSProperties;
  }

  const Flag: ComponentType<FlagProps>;
  export default Flag;
}

