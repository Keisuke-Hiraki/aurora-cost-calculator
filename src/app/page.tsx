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
  ENGINES,
  HOURS_PER_MONTH,
  getPricingForRegion
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
    // 詳細なコスト内訳を追加
    standardCostDetails: {
      instanceCost: number;
      storageCost: number;
      ioCost: number;
      backupCost: number;
    };
    ioOptimizedCostDetails: {
      instanceCost: number;
      storageCost: number;
      backupCost: number;
    };
    serverlessCostDetails?: {
      acuCost: number;
      storageCost: number;
      backupCost: number;
    };
    // 料金情報も保存
    pricingInfo: {
      hourlyRate: { standard: number; ioOptimized: number };
      acuRate?: number;
      storageRate: number;
      ioRate: number;
      backupRate: number;
    };
  } | null>(null);

  const handleSubmit = (formData: FormData) => {
    setLoading(true);

    // 計算処理をシミュレートするための短いタイムアウト
    setTimeout(() => {
      // 料金データの取得
      const pricing = getPricingForRegion(formData.region, formData.engine);
      
      // 時間料金の取得（リザーブドインスタンス割引適用前）
      let standardHourlyRate = pricing.STANDARD.INSTANCE_PRICING[formData.instanceType] || 0;
      let ioOptimizedHourlyRate = pricing.IO_OPTIMIZED.INSTANCE_PRICING[formData.instanceType] || 0;
      let acuRate = pricing.SERVERLESS_V2.ACU_PRICING;
      
      // リザーブドインスタンスの割引率
      let discount = 0;
      if (formData.useReservedInstance) {
        discount = pricing.RESERVED_INSTANCE[formData.reservedInstanceType as keyof typeof pricing.RESERVED_INSTANCE];
        standardHourlyRate *= (1 - discount);
        ioOptimizedHourlyRate *= (1 - discount);
      }
      
      // ストレージ、I/O、バックアップレート
      const storageRate = pricing.STANDARD.STORAGE_PRICING;
      const ioRate = pricing.STANDARD.IO_PRICING;
      const backupRate = pricing.STANDARD.BACKUP_PRICING;
      
      // Standard詳細コスト計算
      const standardInstanceCost = standardHourlyRate * HOURS_PER_MONTH;
      const standardStorageCost = formData.storageGB * storageRate;
      const standardIoCost = formData.ioRequests * ioRate;
      const standardBackupCost = formData.storageGB * 0.25 * backupRate; // バックアップはストレージの25%と想定
      const standardCost = standardInstanceCost + standardStorageCost + standardIoCost + standardBackupCost;
      
      // I/O-Optimized詳細コスト計算
      const ioOptimizedInstanceCost = ioOptimizedHourlyRate * HOURS_PER_MONTH;
      const ioOptimizedStorageCost = formData.storageGB * storageRate;
      const ioOptimizedBackupCost = formData.storageGB * 0.25 * backupRate;
      const ioOptimizedCost = ioOptimizedInstanceCost + ioOptimizedStorageCost + ioOptimizedBackupCost;
      
      // Serverless v2コスト計算
      let serverlessCost;
      let serverlessCostDetails;
      if (formData.useServerlessV2) {
        const acuCost = formData.averageACU * acuRate * HOURS_PER_MONTH;
        const serverlessStorageCost = formData.storageGB * storageRate;
        const serverlessBackupCost = formData.storageGB * 0.25 * backupRate;
        serverlessCost = acuCost + serverlessStorageCost + serverlessBackupCost;
        serverlessCostDetails = {
          acuCost,
          storageCost: serverlessStorageCost,
          backupCost: serverlessBackupCost
        };
      }

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
        // コスト詳細
        standardCostDetails: {
          instanceCost: standardInstanceCost,
          storageCost: standardStorageCost,
          ioCost: standardIoCost,
          backupCost: standardBackupCost
        },
        ioOptimizedCostDetails: {
          instanceCost: ioOptimizedInstanceCost,
          storageCost: ioOptimizedStorageCost,
          backupCost: ioOptimizedBackupCost
        },
        serverlessCostDetails,
        // 料金情報
        pricingInfo: {
          hourlyRate: { 
            standard: standardHourlyRate, 
            ioOptimized: ioOptimizedHourlyRate 
          },
          acuRate,
          storageRate,
          ioRate,
          backupRate
        }
      });

      setLoading(false);
    }, 500);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
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
                      <li>
                        インスタンスコスト: {formatCurrency(results.standardCostDetails.instanceCost)}
                        <div className="text-xs text-gray-600 ml-4">
                          {formatCurrency(results.pricingInfo.hourlyRate.standard)}/時間 × {HOURS_PER_MONTH}時間
                        </div>
                      </li>
                      <li>
                        ストレージコスト: {formatCurrency(results.standardCostDetails.storageCost)}
                        <div className="text-xs text-gray-600 ml-4">
                          {results.formData.storageGB.toLocaleString()} GB × {formatCurrency(results.pricingInfo.storageRate)}/GB
                        </div>
                      </li>
                      <li>
                        I/Oコスト: {formatCurrency(results.standardCostDetails.ioCost)}
                        <div className="text-xs text-gray-600 ml-4">
                          {results.formData.ioRequests.toLocaleString()} 百万リクエスト × {formatCurrency(results.pricingInfo.ioRate)}/百万リクエスト
                        </div>
                      </li>
                      <li>
                        バックアップコスト: {formatCurrency(results.standardCostDetails.backupCost)}
                        <div className="text-xs text-gray-600 ml-4">
                          {results.formData.storageGB.toLocaleString()} GB × 25% × {formatCurrency(results.pricingInfo.backupRate)}/GB
                        </div>
                      </li>
                      <li className="font-semibold pt-2">
                        合計月額コスト: {formatCurrency(results.standardCost)}
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Aurora I/O-Optimized コスト内訳</h4>
                    <ul className="text-sm space-y-1">
                      <li>
                        インスタンスコスト: {formatCurrency(results.ioOptimizedCostDetails.instanceCost)}
                        <div className="text-xs text-gray-600 ml-4">
                          {formatCurrency(results.pricingInfo.hourlyRate.ioOptimized)}/時間 × {HOURS_PER_MONTH}時間
                        </div>
                      </li>
                      <li>
                        ストレージコスト: {formatCurrency(results.ioOptimizedCostDetails.storageCost)}
                        <div className="text-xs text-gray-600 ml-4">
                          {results.formData.storageGB.toLocaleString()} GB × {formatCurrency(results.pricingInfo.storageRate)}/GB
                        </div>
                      </li>
                      <li>
                        I/Oコスト: {formatCurrency(0)}
                        <div className="text-xs text-gray-600 ml-4">
                          I/O-Optimizedモードでは無料
                        </div>
                      </li>
                      <li>
                        バックアップコスト: {formatCurrency(results.ioOptimizedCostDetails.backupCost)}
                        <div className="text-xs text-gray-600 ml-4">
                          {results.formData.storageGB.toLocaleString()} GB × 25% × {formatCurrency(results.pricingInfo.backupRate)}/GB
                        </div>
                      </li>
                      <li className="font-semibold pt-2">
                        合計月額コスト: {formatCurrency(results.ioOptimizedCost)}
                      </li>
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
                    <li>
                      ACUコスト: {formatCurrency(results.serverlessCostDetails!.acuCost)}
                      <div className="text-xs text-gray-600 ml-4">
                        {results.formData.averageACU} ACU × {formatCurrency(results.pricingInfo.acuRate!)}/ACU時間 × {HOURS_PER_MONTH}時間
                      </div>
                    </li>
                    <li>
                      ストレージコスト: {formatCurrency(results.serverlessCostDetails!.storageCost)}
                      <div className="text-xs text-gray-600 ml-4">
                        {results.formData.storageGB.toLocaleString()} GB × {formatCurrency(results.pricingInfo.storageRate)}/GB
                      </div>
                    </li>
                    <li>
                      バックアップコスト: {formatCurrency(results.serverlessCostDetails!.backupCost)}
                      <div className="text-xs text-gray-600 ml-4">
                        {results.formData.storageGB.toLocaleString()} GB × 25% × {formatCurrency(results.pricingInfo.backupRate)}/GB
                      </div>
                    </li>
                    <li className="font-semibold pt-2">
                      合計月額コスト: {formatCurrency(results.serverlessCost!)}
                    </li>
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