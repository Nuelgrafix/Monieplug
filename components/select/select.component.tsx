"use client";

import ReactSelect, {
  ControlProps,
  GroupBase,
  Props,
  StylesConfig,
} from "react-select";



type CP = ControlProps<unknown, boolean, GroupBase<unknown>>;

interface CProps extends CP {
  selectProps: CP["selectProps"] & { error?: string };
}

export const styles: StylesConfig = {
  control: (base, state: CProps) => ({
    ...base,
    borderColor: state?.selectProps?.error
      ? "rgb(var(--color-site-d))"
      : "#D0D5DD",
    borderRadius: "6px",
    overFlow: "hidden ",
    backgroundColor: "transparent",
    padding: "0 16px",
    fontFamily: "Metropolis, sans-serif",
    fontSize: "12px",
    fontWeight: 500,
    color: "rgb(var(--color-site-a))",
    boxShadow: state.isFocused
      ? `0 0 0 1px ${
          state.selectProps.error
            ? "rgb(var(--color-site-d))"
            : "rgb(var(--color-site-h))"
        }`
      : undefined,
    ":hover": {
      borderColor: state?.selectProps?.error
        ? "rgb(var(--color-site-d))"
        : "rgb(var(--color-site-h))",
    },
    height: "44px",
    width: "100%",
    flexWrap: "nowrap",
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "1.2rem 0",
  }),
  indicatorsContainer: (base) => ({
    ...base,
    padding: 0,
  }),
  input: (base) => ({
    ...base,
    color: "rgb(var(--color-site-a))",
    padding: 0,
  }),
  placeholder: (base) => ({ ...base, whiteSpace: "nowrap" }),
  menu: (base) => ({
    ...base,
    borderRadius: "0.8rem",
    boxShadow: "0px 4px 6px -2px #05284C",
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
    borderRadius: "6px",
    maxHeight: "200px",
    overflowY: "auto",

    /* Firefox: hide scrollbar */
    scrollbarWidth: "none",

    /* WebKit browsers */
    "&::-webkit-scrollbar": {
      width: 0,
      height: 0,
      borderRadius: "6px",
      backgroundColor: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      display: "none",
      borderRadius: "6px",
    },

    /* Show scrollbar on hover */
    // "&:hover": {
    //   scrollbarWidth: "thin", // Firefox

    //   "&::-webkit-scrollbar": {
    //     width: "5px",
    //     height: "5px",
    //     overflow: "hidden",
    //     backgroundColor: "transparent",
    //   },
    //   "&::-webkit-scrollbar-thumb": {
    //     display: "block",
    //     backgroundColor: "#cbd5e1",
    //     borderRadius: "9999px",
    //     overflow: "hidden",
    //     transition: "background-color 0.3s ease",
    //   },
    // },
  }),

  option: (base) => ({
    ...base,
    padding: "10px 12px",
    cursor: "pointer",
    overFlow: "hidden",
    color: "#667085",
    borderBottom: "1px solid #F2F4F7",
    borderTop: "1px solid #F2F4F7",
    backgroundColor: "rgb(var(--color-white))",
    width: "100%",
    scrollbarWidth: "none",
    ":active": {
      backgroundColor: "#667085",
    },
    ":hover": {
      backgroundColor: "#f5faff",
    },
  }),
};

interface ISelectProps extends Props {
  error?: string;
}

const Select = (props: ISelectProps) => {
  return (
    <>
      <div className="relative w-full">
        <ReactSelect
          components={{ IndicatorSeparator: null }}
          styles={styles}
          instanceId={props.inputId}
          {...props}
        />

        {/* <p className={formStyles.footerText}>{props.error}</p> */}
      </div>
    </>
  );
};

export default Select;
