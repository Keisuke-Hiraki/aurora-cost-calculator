import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface BreakEvenChartProps {
  data: Array<{
    io: number;
    standardCost: number;
    ioOptimizedCost: number;
  }>;
  breakEvenPoint?: number;
  unit?: string;
}

const BreakEvenChart: React.FC<BreakEvenChartProps> = ({
  data,
  breakEvenPoint,
  unit = '百万I/Oリクエスト'
}) => {
  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="w-full h-96 mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="io"
            label={{ value: unit, position: 'insideBottomRight', offset: -10 }}
          />
          <YAxis
            label={{ 
              value: '月間コスト（USD）', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }}
            tickFormatter={formatCurrency}
          />
          <Tooltip
            formatter={(value: number) => [`${formatCurrency(value)}`, '']}
            labelFormatter={(label) => `${label} ${unit}`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="standardCost" 
            name="Aurora Standard" 
            stroke="#4285F4" 
            activeDot={{ r: 8 }} 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="ioOptimizedCost" 
            name="Aurora I/O-Optimized" 
            stroke="#FF9900" 
            activeDot={{ r: 8 }} 
            strokeWidth={2}
          />
          {breakEvenPoint !== undefined && breakEvenPoint > 0 && (
            <ReferenceLine
              x={breakEvenPoint}
              stroke="red"
              strokeDasharray="3 3"
              label={{
                value: `損益分岐点: ${breakEvenPoint.toFixed(1)} ${unit}`,
                position: 'top',
                fill: 'red',
                fontSize: 12
              }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BreakEvenChart;
