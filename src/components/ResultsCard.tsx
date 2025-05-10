import React from 'react';

interface ResultsCardProps {
  title: string;
  monthlyCost: number;
  yearlyProjection?: number;
  savings?: {
    amount: number;
    percentage: number;
  };
  isRecommended?: boolean;
}

const ResultsCard: React.FC<ResultsCardProps> = ({
  title,
  monthlyCost,
  yearlyProjection,
  savings,
  isRecommended = false,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div 
      className={`
        bg-white rounded-lg shadow-md p-5 flex flex-col
        ${isRecommended ? 'border-2 border-amazon-orange' : 'border border-gray-200'}
      `}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold">{title}</h3>
        {isRecommended && (
          <span className="bg-amazon-orange text-white text-xs px-2 py-1 rounded-full">
            推奨
          </span>
        )}
      </div>

      <div className="my-2">
        <p className="text-gray-600 text-sm">月額コスト</p>
        <p className="text-2xl font-bold">{formatCurrency(monthlyCost)}</p>
      </div>

      {yearlyProjection && (
        <div className="my-2">
          <p className="text-gray-600 text-sm">年間予測コスト</p>
          <p className="text-lg font-semibold">{formatCurrency(yearlyProjection)}</p>
        </div>
      )}

      {savings && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-gray-600 text-sm">他の選択肢と比較した場合の節約額</p>
          <p className="font-semibold text-green-600">
            {formatCurrency(savings.amount)} ({savings.percentage.toFixed(1)}%)
          </p>
        </div>
      )}
    </div>
  );
};

export default ResultsCard;
