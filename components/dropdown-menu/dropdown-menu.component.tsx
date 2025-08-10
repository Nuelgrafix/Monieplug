"use client";

import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import type { ReactElement, ReactNode } from "react";

import styles from "./dropdown-menu.module.css";

interface IDropdownMenuProps {
  trigger: ReactElement;
  children: ReactNode;
}

export const DropdownItem = ({
  children,
  ...props
}: RadixDropdown.DropdownMenuItemProps) => (
  <RadixDropdown.Item {...props} className={styles.item}>
    {children}
  </RadixDropdown.Item>
);

const DropdownMenu = ({ children, trigger }: IDropdownMenuProps) => {
  return (
    <RadixDropdown.Root>
      <RadixDropdown.Trigger asChild>{trigger}</RadixDropdown.Trigger>

      <RadixDropdown.Portal>
        <RadixDropdown.Content
          sideOffset={10}
          collisionPadding={10}
          align="end"
          className={styles.content}
        >
          {children}
        </RadixDropdown.Content>
      </RadixDropdown.Portal>
    </RadixDropdown.Root>
  );
};

export default DropdownMenu;
