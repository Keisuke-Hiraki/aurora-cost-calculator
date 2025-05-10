import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface StorageComparisonChartProps {
  data: Array<{
    storage: number;
    standardCost: number;
    ioOptimizedCost: number;
  }>;
}

const StorageComparisonChart: React.FC<StorageComparisonChartProps> = ({
  data
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
            dataKey="storage"
            label={{ value: 'ストレージサイズ（GB）', position: 'insideBottomRight', offset: -10 }}
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
            labelFormatter={(label) => `${label} GB`}
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
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StorageComparisonChart;
