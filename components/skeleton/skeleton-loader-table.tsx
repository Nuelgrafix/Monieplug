import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const baseColor = "#EFF4F8";
const highlightColor = "#8A8A8D4D";

interface Props {
  count?: number; // Number of skeleton rows to display
  columns?: number; // Number of skeleton columns (besides the avatar column)
}

const EmptyTableFallback = ({ count = 3, columns = 4 }: Props) => {
  return (
    <>
      {Array.from({ length: count }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-gray-100">
          {/* Column 1: Circle + Text */}
          <td className="px-4 py-3">
            <div className="flex items-center gap-2">
              <Skeleton
                circle
                width={36}
                height={36}
                baseColor={baseColor}
                highlightColor={highlightColor}
              />
              <Skeleton
                height={14}
                width={80}
                baseColor={baseColor}
                highlightColor={highlightColor}
              />
            </div>
          </td>

          {/* Dynamic Skeleton Columns */}
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="px-4 py-3">
              <Skeleton
                height={14}
                width="100%"
                baseColor={baseColor}
                highlightColor={highlightColor}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default EmptyTableFallback;
