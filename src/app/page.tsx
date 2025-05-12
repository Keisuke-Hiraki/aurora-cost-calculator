'use client';

import { useState } from 'react';
import InputForm, { FormData } from '@/components/InputForm';
import ResultsCard from '@/components/ResultsCard';
import BreakEvenChart from '@/components/BreakEvenChart';
import StorageComparisonChart from '@/components/StorageComparisonChart';
import {
  calculateStandardMonthlyCost,
  calculateIoOptimizedMonthlyCost,
  calculateServerlessV2MonthlyCost,
  calculateBreakEvenIORequests,
  generateBreakEvenGraphData,
  generateStorageComparisonData,
  determineOptimalAuroraType,
  estimateACUFromInstanceType,
  REGIONS,
  ENGINES
} from '@/utils/pricing';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    formData: FormData;
    standardCost: number;
    ioOptimizedCost: number;
    serverlessCost?: number;
    breakEvenPoint: number;
    breakEvenGraphData: Array<{
      io: number;
      standardCost: number;
      ioOptimizedCost: number;
    }>;
    storageGraphData: Array<{
      storage: number;
      standardCost: number;
      ioOptimizedCost: number;
    }>;
    recommendedOption: string;
  } | null>(null);

  const handleSubmit = (formData: FormData) => {
    setLoading(true);

    // 計算処理をシミュレートするための短いタイムアウト
    setTimeout(() => {
      // Aurora Standard コスト計算
      const standardCost = calculateStandardMonthlyCost(
        formData.instanceType,
        formData.storageGB,
        formData.ioRequests,
        formData.useReservedInstance,
        formData.reservedInstanceType as any,
        formData.region,
        formData.engine
      );

      // Aurora I/O-Optimized コスト計算
      const ioOptimizedCost = calculateIoOptimizedMonthlyCost(
        formData.instanceType,
        formData.storageGB,
        formData.useReservedInstance,
        formData.reservedInstanceType as any,
        formData.region,
        formData.engine
      );

      // 損益分岐点の計算
      const breakEvenPoint = calculateBreakEvenIORequests(
        formData.instanceType,
        formData.storageGB,
        formData.useReservedInstance,
        formData.reservedInstanceType as any,
        formData.region,
        formData.engine
      );

      // I/O量に対するコスト比較グラフ用データ
      const breakEvenGraphData = generateBreakEvenGraphData(
        formData.instanceType,
        formData.storageGB,
        Math.max(formData.ioRequests * 2, breakEvenPoint * 1.5, 100),
        formData.useReservedInstance,
        formData.reservedInstanceType as any,
        formData.region,
        formData.engine
      );

      // ストレージサイズに対するコスト比較グラフ用データ
      const storageGraphData = generateStorageComparisonData(
        formData.instanceType,
        formData.ioRequests,
        Math.max(formData.storageGB * 2, 1000),
        formData.useReservedInstance,
        formData.reservedInstanceType as any,
        formData.region,
        formData.engine
      );

      // Aurora Serverless v2のコスト計算（選択した場合）
      let serverlessCost;
      if (formData.useServerlessV2) {
        serverlessCost = calculateServerlessV2MonthlyCost(
          formData.averageACU,
          formData.storageGB,
          formData.region,
          formData.engine
        );
      }

      // 最適な選択肢の判断
      let recommendedOption;
      if (formData.useServerlessV2) {
        // ServerlessとStandardとI/O-Optimizedを比較
        const standardEquivalentACU = estimateACUFromInstanceType(formData.instanceType);
        const standardEquivalentCost = calculateServerlessV2MonthlyCost(
          standardEquivalentACU,
          formData.storageGB,
          formData.region,
          formData.engine
        );

        if (serverlessCost! < Math.min(standardCost, ioOptimizedCost)) {
          recommendedOption = 'Serverless v2';
        } else if (standardCost < ioOptimizedCost) {
          recommendedOption = 'Standard';
        } else {
          recommendedOption = 'I/O-Optimized';
        }
      } else {
        // StandardとI/O-Optimizedを比較
        const { recommendedType } = determineOptimalAuroraType(
          formData.instanceType,
          formData.storageGB,
          formData.ioRequests,
          formData.useReservedInstance,
          formData.reservedInstanceType as any,
          formData.region,
          formData.engine
        );
        recommendedOption = recommendedType;
      }

      setResults({
        formData,
        standardCost,
        ioOptimizedCost,
        serverlessCost,
        breakEvenPoint,
        breakEvenGraphData,
        storageGraphData,
        recommendedOption,
      });

      setLoading(false);
    }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <section className="mb-10">
        <div className="bg-gradient-to-r from-amazon-navy to-blue-700 text-white p-6 rounded-lg mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-3">Aurora 料金モデル損益分岐点計算ツール</h1>
          <p className="text-lg opacity-90">
            AWS Aurora DatabaseのStandardモードとI/O-Optimizedモードの損益分岐点を計算し、
            料金比較やリザーブドインスタンス、Aurora Serverless v2を含めた最適な選択肢を提案します。
          </p>
        </div>

        <InputForm onSubmit={handleSubmit} isLoading={loading} />
      </section>

      {results && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">計算結果</h2>
          <p className="mb-4">
            選択したリージョン: <strong>{REGIONS[results.formData.region as keyof typeof REGIONS]}</strong>
          </p>
          <p className="mb-4">
            データベースエンジン: <strong>{ENGINES[results.formData.engine]}</strong>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Aurora Standard カード */}
            <ResultsCard
              title="Aurora Standard"
              monthlyCost={results.standardCost}
              yearlyProjection={results.standardCost * 12}
              isRecommended={results.recommendedOption === 'Standard'}
              savings={
                results.recommendedOption === 'Standard'
                  ? {
                      amount: results.ioOptimizedCost - results.standardCost,
                      percentage: ((results.ioOptimizedCost - results.standardCost) / results.ioOptimizedCost) * 100,
                    }
                  : undefined
              }
            />

            {/* Aurora I/O-Optimized カード */}
            <ResultsCard
              title="Aurora I/O-Optimized"
              monthlyCost={results.ioOptimizedCost}
              yearlyProjection={results.ioOptimizedCost * 12}
              isRecommended={results.recommendedOption === 'I/O-Optimized'}
              savings={
                results.recommendedOption === 'I/O-Optimized'
                  ? {
                      amount: results.standardCost - results.ioOptimizedCost,
                      percentage: ((results.standardCost - results.ioOptimizedCost) / results.standardCost) * 100,
                    }
                  : undefined
              }
            />

            {/* Aurora Serverless v2 カード（選択した場合のみ表示） */}
            {results.serverlessCost && (
              <ResultsCard
                title="Aurora Serverless v2"
                monthlyCost={results.serverlessCost}
                yearlyProjection={results.serverlessCost * 12}
                isRecommended={results.recommendedOption === 'Serverless v2'}
                savings={
                  results.recommendedOption === 'Serverless v2'
                    ? {
                        amount: Math.min(results.standardCost, results.ioOptimizedCost) - results.serverlessCost,
                        percentage: 
                          ((Math.min(results.standardCost, results.ioOptimizedCost) - results.serverlessCost) / 
                          Math.min(results.standardCost, results.ioOptimizedCost)) * 100,
                      }
                    : undefined
                }
              />
            )}
          </div>

          {!results.formData.useServerlessV2 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">損益分岐点分析</h3>
              
              {results.breakEvenPoint > 0 ? (
                <>
                  <p className="mb-4">
                    月間I/Oリクエスト数が <strong>{results.breakEvenPoint.toFixed(1)}百万</strong> を超える場合、
                    <strong>Aurora I/O-Optimized</strong> の方がコスト効率が良くなります。
                    それ以下の場合は <strong>Aurora Standard</strong> の方が経済的です。
                  </p>
                  <BreakEvenChart 
                    data={results.breakEvenGraphData}
                    breakEvenPoint={results.breakEvenPoint}
                  />
                </>
              ) : (
                <p className="mb-4">
                  設定した条件では、<strong>Aurora I/O-Optimized</strong> が常に
                  <strong>Aurora Standard</strong> よりもコスト効率が良くなります。
                  <BreakEvenChart 
                    data={results.breakEvenGraphData}
                  />
                </p>
              )}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">ストレージサイズによる料金比較</h3>
            <p className="mb-4">
              ストレージサイズに対する月間コストの比較です。
              ストレージコストは両方のモデルで同じですが、インスタンスコストとI/Oコストの違いにより
              全体的なコスト傾向が異なります。
            </p>
            <StorageComparisonChart data={results.storageGraphData} />
          </div>

          {/* 料金内訳 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">コスト詳細</h3>
            
            {!results.formData.useServerlessV2 ? (
              <>
                <p className="font-medium text-lg mb-2">選択したインスタンス: {results.formData.instanceType}</p>
                {results.formData.useReservedInstance && (
                  <p className="text-sm text-gray-600 mb-4">
                    リザーブドインスタンス: {
                      results.formData.reservedInstanceType === 'ONE_YEAR_PARTIAL_UPFRONT' ? '1年間 - 一部前払い' :
                      results.formData.reservedInstanceType === 'THREE_YEAR_PARTIAL_UPFRONT' ? '3年間 - 一部前払い' :
                      results.formData.reservedInstanceType === 'ONE_YEAR_ALL_UPFRONT' ? '1年間 - 全額前払い' :
                      '3年間 - 全額前払い'
                    }
                  </p>
                )}
                <p className="mb-4">
                  ストレージサイズ: {results.formData.storageGB.toLocaleString()} GB  |  
                  月間I/Oリクエスト: {results.formData.ioRequests.toLocaleString()} 百万
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Aurora Standard コスト内訳</h4>
                    <ul className="text-sm space-y-1">
                      <li>インスタンスコスト: ${(results.standardCost * 0.7).toFixed(2)}</li>
                      <li>ストレージコスト: ${(results.formData.storageGB * 0.10 * (results.formData.region === 'us-east-1' ? 1.0 : 1.15)).toFixed(2)}</li>
                      <li>I/Oコスト: ${(results.formData.ioRequests * 0.20 * (results.formData.region === 'us-east-1' ? 1.0 : 1.25)).toFixed(2)}</li>
                      <li>バックアップコスト: ${(results.formData.storageGB * 0.25 * 0.021 * (results.formData.region === 'us-east-1' ? 1.0 : 1.15)).toFixed(2)}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Aurora I/O-Optimized コスト内訳</h4>
                    <ul className="text-sm space-y-1">
                      <li>インスタンスコスト: ${(results.ioOptimizedCost * 0.85).toFixed(2)}</li>
                      <li>ストレージコスト: ${(results.formData.storageGB * 0.10 * (results.formData.region === 'us-east-1' ? 1.0 : 1.15)).toFixed(2)}</li>
                      <li>I/Oコスト: $0.00 (I/O料金なし)</li>
                      <li>バックアップコスト: ${(results.formData.storageGB * 0.25 * 0.021 * (results.formData.region === 'us-east-1' ? 1.0 : 1.15)).toFixed(2)}</li>
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="font-medium text-lg mb-2">Aurora Serverless v2</p>
                <p className="mb-4">
                  平均ACU使用量: {results.formData.averageACU}  |  
                  ストレージサイズ: {results.formData.storageGB.toLocaleString()} GB
                </p>
                <div>
                  <h4 className="font-semibold mb-2">Aurora Serverless v2 コスト内訳</h4>
                  <ul className="text-sm space-y-1">
                    <li>ACUコスト: ${(results.formData.averageACU * (results.formData.engine === 'mysql' ? 0.12 : 0.14) * 24 * 30 * (results.formData.region === 'us-east-1' ? 1.0 : 1.25)).toFixed(2)}</li>
                    <li>ストレージコスト: ${(results.formData.storageGB * 0.10 * (results.formData.region === 'us-east-1' ? 1.0 : 1.15)).toFixed(2)}</li>
                    <li>バックアップコスト: ${(results.formData.storageGB * 0.25 * 0.021 * (results.formData.region === 'us-east-1' ? 1.0 : 1.15)).toFixed(2)}</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </section>
      )}
    </div>
  );
}