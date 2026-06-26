import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type BarShapeProps,
} from "recharts";

export type ChartItem = {
  name: string;
  quantity: number;
  daysLeft: number;
  reorderPoint: number;
  needsRestock: boolean;
  fillClass: string;
};

type InventoryChartProps = {
  title: string;
  data: ChartItem[];
  dataKey: "quantity" | "daysLeft";
};

const InventoryBar = ({
  payload,
  ...props
}: BarShapeProps & { payload?: ChartItem }) => (
  <Rectangle
    {...props}
    className={payload?.fillClass ?? "fill-secondary-base"}
    radius={[4, 4, 0, 0]}
  />
);

const InventoryChart = ({ title, data, dataKey }: InventoryChartProps) => (
  <div className="border-border bg-panel h-72 rounded-lg border p-4">
    <h3 className="text-text-secondary mb-3 text-sm font-semibold">{title}</h3>
    <ResponsiveContainer width="100%" height="90%">
      <BarChart data={data}>
        <CartesianGrid className="stroke-border" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ className: "fill-text-secondary text-xs" }}
        />
        <YAxis tick={{ className: "fill-text-secondary text-xs" }} />
        <Tooltip />
        <Bar dataKey={dataKey} shape={InventoryBar} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default InventoryChart;
