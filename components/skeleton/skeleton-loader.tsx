import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./styles.module.scss";
import SvgIcon from "@/components/svg-icon/svg-icon.component";


const baseColor = "#EFF4F8";
const highlightColor = "#8A8A8D4D";

interface EmptyTableStateProps {
  title: string;
  description?: string;
  buttonText?: string;
  buttonAction?: () => void;
  showButton?: boolean;
}

const EmptyTableState = ({
  title,
  description,
  buttonText,
  buttonAction,
  showButton = true,
}: EmptyTableStateProps) => {
  return (
    <div className={styles.emptyStateContainer}>
      <div className={styles.skeletonContainer}>
        {[...Array(5)].map((_, i) => (
          <div className={styles.skeletonRow} key={i}>
            <Skeleton
              circle
              className={styles.skeletonCircle}
              baseColor={baseColor}
              highlightColor={highlightColor}
            />
            <Skeleton
              className={`${styles.skeletonBar} ${styles.skeletonBar1}`}
              baseColor={baseColor}
              highlightColor={highlightColor}
            />
            <Skeleton
              className={`${styles.skeletonBar} ${styles.skeletonBar2}`}
              baseColor={baseColor}
              highlightColor={highlightColor}
            />
            <Skeleton
              className={`${styles.skeletonBar} ${styles.skeletonBar3}`}
              baseColor={baseColor}
              highlightColor={highlightColor}
            />
          </div>
        ))}
      </div>

      <div className={styles.emptyStateContent}>
        <p className={styles.emptyStateTitle}>{title}</p>
        <p className={styles.emptyStateDescription}>{description}</p>
        {showButton && (
          <button
            className={styles.actionButton}
            type="button"
            onClick={buttonAction}
          >
            <SvgIcon
              className="!text-[#FFFFFF] items-center w-3 h-3"
              iconName="FaPlus"
            />
            <span>{buttonText}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyTableState;
