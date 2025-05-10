// Aurora料金設定（例：東京リージョン、実際の料金は変更される可能性があります）
export const PRICING = {
  // Aurora Standard料金
  STANDARD: {
    // インスタンスタイプごとの時間単価（USD/時間）
    INSTANCE_PRICING: {
      'db.t4g.medium': 0.072,
      'db.t4g.large': 0.144,
      'db.r6g.large': 0.29,
      'db.r6g.xlarge': 0.58,
      'db.r6g.2xlarge': 1.16,
      'db.r6g.4xlarge': 2.32,
      'db.r6g.8xlarge': 4.64,
      'db.r6g.12xlarge': 6.96,
      'db.r6g.16xlarge': 9.28,
      'db.r5.large': 0.33,
      'db.r5.xlarge': 0.66,
      'db.r5.2xlarge': 1.32,
      'db.r5.4xlarge': 2.64,
      'db.r5.8xlarge': 5.28,
      'db.r5.12xlarge': 7.92,
      'db.r5.16xlarge': 10.56,
      'db.r5.24xlarge': 15.84,
    },
    // ストレージ料金（USD/GiB/月）
    STORAGE_PRICING: 0.10,
    // I/O料金（USD/100万リクエスト）
    IO_PRICING: 0.20,
    // バックアップストレージ料金（USD/GiB/月）
    BACKUP_PRICING: 0.021,
  },
  
  // Aurora I/O-Optimized料金
  IO_OPTIMIZED: {
    // インスタンスタイプごとの時間単価（USD/時間） - Standard料金の約1.3倍
    INSTANCE_PRICING: {
      'db.t4g.medium': 0.094,
      'db.t4g.large': 0.187,
      'db.r6g.large': 0.377,
      'db.r6g.xlarge': 0.754,
      'db.r6g.2xlarge': 1.508,
      'db.r6g.4xlarge': 3.016,
      'db.r6g.8xlarge': 6.032,
      'db.r6g.12xlarge': 9.048,
      'db.r6g.16xlarge': 12.064,
      'db.r5.large': 0.429,
      'db.r5.xlarge': 0.858,
      'db.r5.2xlarge': 1.716,
      'db.r5.4xlarge': 3.432,
      'db.r5.8xlarge': 6.864,
      'db.r5.12xlarge': 10.296,
      'db.r5.16xlarge': 13.728,
      'db.r5.24xlarge': 20.592,
    },
    // ストレージ料金（USD/GiB/月）
    STORAGE_PRICING: 0.10,
    // I/O料金 - I/O-Optimizedでは追加料金なし
    IO_PRICING: 0,
    // バックアップストレージ料金（USD/GiB/月）
    BACKUP_PRICING: 0.021,
  },
  
  // Aurora Serverless v2料金
  SERVERLESS_V2: {
    // ACU単価（USD/ACU時間）
    ACU_PRICING: 0.12,
    // ストレージ料金（USD/GiB/月）
    STORAGE_PRICING: 0.10,
    // バックアップストレージ料金（USD/GiB/月）
    BACKUP_PRICING: 0.021,
  },
  
  // リザーブドインスタンスの割引率（概算）
  RESERVED_INSTANCE: {
    // 1年間、部分前払い
    ONE_YEAR_PARTIAL_UPFRONT: 0.40, // 40%割引
    // 3年間、部分前払い
    THREE_YEAR_PARTIAL_UPFRONT: 0.60, // 60%割引
    // 1年間、全額前払い
    ONE_YEAR_ALL_UPFRONT: 0.45, // 45%割引
    // 3年間、全額前払い
    THREE_YEAR_ALL_UPFRONT: 0.65, // 65%割引
  }
};

// インスタンスタイプ一覧
export const INSTANCE_TYPES = Object.keys(PRICING.STANDARD.INSTANCE_PRICING);

// 月間コスト計算 - Aurora Standard
export function calculateStandardMonthlyCost(
  instanceType: string,
  storageGB: number,
  ioRequests: number, // 百万単位
  useReservedInstance: boolean = false,
  reservedInstanceType: keyof typeof PRICING.RESERVED_INSTANCE = 'ONE_YEAR_PARTIAL_UPFRONT'
): number {
  // インスタンス時間料金（USD/時間）
  let hourlyRate = PRICING.STANDARD.INSTANCE_PRICING[instanceType as keyof typeof PRICING.STANDARD.INSTANCE_PRICING] || 0;
  
  // リザーブドインスタンスの場合は割引を適用
  if (useReservedInstance) {
    const discount = PRICING.RESERVED_INSTANCE[reservedInstanceType];
    hourlyRate = hourlyRate * (1 - discount);
  }
  
  // 月間インスタンスコスト（30日で計算）
  const instanceCost = hourlyRate * 24 * 30;
  
  // ストレージコスト
  const storageCost = storageGB * PRICING.STANDARD.STORAGE_PRICING;
  
  // I/Oコスト
  const ioCost = ioRequests * PRICING.STANDARD.IO_PRICING;
  
  // バックアップコスト（ストレージの25%と仮定）
  const backupCost = storageGB * 0.25 * PRICING.STANDARD.BACKUP_PRICING;
  
  // 合計コスト
  return instanceCost + storageCost + ioCost + backupCost;
}

// 月間コスト計算 - Aurora I/O-Optimized
export function calculateIoOptimizedMonthlyCost(
  instanceType: string,
  storageGB: number,
  useReservedInstance: boolean = false,
  reservedInstanceType: keyof typeof PRICING.RESERVED_INSTANCE = 'ONE_YEAR_PARTIAL_UPFRONT'
): number {
  // インスタンス時間料金（USD/時間）
  let hourlyRate = PRICING.IO_OPTIMIZED.INSTANCE_PRICING[instanceType as keyof typeof PRICING.IO_OPTIMIZED.INSTANCE_PRICING] || 0;
  
  // リザーブドインスタンスの場合は割引を適用
  if (useReservedInstance) {
    const discount = PRICING.RESERVED_INSTANCE[reservedInstanceType];
    hourlyRate = hourlyRate * (1 - discount);
  }
  
  // 月間インスタンスコスト（30日で計算）
  const instanceCost = hourlyRate * 24 * 30;
  
  // ストレージコスト
  const storageCost = storageGB * PRICING.IO_OPTIMIZED.STORAGE_PRICING;
  
  // バックアップコスト（ストレージの25%と仮定）
  const backupCost = storageGB * 0.25 * PRICING.IO_OPTIMIZED.BACKUP_PRICING;
  
  // 合計コスト（I/O-Optimizedの場合はI/Oコストなし）
  return instanceCost + storageCost + backupCost;
}

// 月間コスト計算 - Aurora Serverless v2
export function calculateServerlessV2MonthlyCost(
  averageACU: number, // 平均ACU使用量
  storageGB: number
): number {
  // ACUコスト
  const acuCost = averageACU * PRICING.SERVERLESS_V2.ACU_PRICING * 24 * 30;
  
  // ストレージコスト
  const storageCost = storageGB * PRICING.SERVERLESS_V2.STORAGE_PRICING;
  
  // バックアップコスト（ストレージの25%と仮定）
  const backupCost = storageGB * 0.25 * PRICING.SERVERLESS_V2.BACKUP_PRICING;
  
  // 合計コスト
  return acuCost + storageCost + backupCost;
}

// 最適なAuroraタイプを決定
export function determineOptimalAuroraType(
  instanceType: string,
  storageGB: number,
  ioRequests: number, // 百万単位
  useReservedInstance: boolean = false,
  reservedInstanceType: keyof typeof PRICING.RESERVED_INSTANCE = 'ONE_YEAR_PARTIAL_UPFRONT'
): {
  recommendedType: string;
  standardCost: number;
  ioOptimizedCost: number;
  savingsAmount: number;
  savingsPercentage: number;
} {
  // 各タイプのコスト計算
  const standardCost = calculateStandardMonthlyCost(
    instanceType, storageGB, ioRequests, useReservedInstance, reservedInstanceType
  );
  
  const ioOptimizedCost = calculateIoOptimizedMonthlyCost(
    instanceType, storageGB, useReservedInstance, reservedInstanceType
  );
  
  // 差額計算
  const savingsAmount = Math.abs(standardCost - ioOptimizedCost);
  const savingsPercentage = (savingsAmount / Math.max(standardCost, ioOptimizedCost)) * 100;
  
  // 最適なタイプを判断
  const recommendedType = standardCost < ioOptimizedCost ? 'Aurora Standard' : 'Aurora I/O-Optimized';
  
  return {
    recommendedType,
    standardCost,
    ioOptimizedCost,
    savingsAmount,
    savingsPercentage
  };
}

// 損益分岐点のI/O使用量を計算
export function calculateBreakEvenIORequests(
  instanceType: string,
  storageGB: number,
  useReservedInstance: boolean = false,
  reservedInstanceType: keyof typeof PRICING.RESERVED_INSTANCE = 'ONE_YEAR_PARTIAL_UPFRONT'
): number {
  // インスタンス料金（リザーブドインスタンス割引適用済み）
  let standardHourlyRate = PRICING.STANDARD.INSTANCE_PRICING[instanceType as keyof typeof PRICING.STANDARD.INSTANCE_PRICING] || 0;
  let ioOptimizedHourlyRate = PRICING.IO_OPTIMIZED.INSTANCE_PRICING[instanceType as keyof typeof PRICING.IO_OPTIMIZED.INSTANCE_PRICING] || 0;
  
  if (useReservedInstance) {
    const discount = PRICING.RESERVED_INSTANCE[reservedInstanceType];
    standardHourlyRate = standardHourlyRate * (1 - discount);
    ioOptimizedHourlyRate = ioOptimizedHourlyRate * (1 - discount);
  }
  
  // 月間固定コスト（インスタンス + ストレージ + バックアップ）
  const standardFixedCost = (standardHourlyRate * 24 * 30) + 
                           (storageGB * PRICING.STANDARD.STORAGE_PRICING) + 
                           (storageGB * 0.25 * PRICING.STANDARD.BACKUP_PRICING);
  
  const ioOptimizedFixedCost = (ioOptimizedHourlyRate * 24 * 30) + 
                              (storageGB * PRICING.IO_OPTIMIZED.STORAGE_PRICING) + 
                              (storageGB * 0.25 * PRICING.IO_OPTIMIZED.BACKUP_PRICING);
  
  // I/O-Optimizedの固定コストが高い場合、損益分岐点を計算
  if (ioOptimizedFixedCost > standardFixedCost) {
    // I/O-OptimizedとStandardが等しくなるI/O量を計算
    // ioOptimizedFixedCost = standardFixedCost + (io * IO_PRICING)
    // 解いて: io = (ioOptimizedFixedCost - standardFixedCost) / IO_PRICING
    return (ioOptimizedFixedCost - standardFixedCost) / PRICING.STANDARD.IO_PRICING;
  } else {
    // I/O-Optimizedの固定コストが低い場合、標準が有利になることはない
    return 0;
  }
}

// 損益分岐点計算に必要なグラフデータを生成
export function generateBreakEvenGraphData(
  instanceType: string,
  storageGB: number,
  maxIO: number = 100, // 最大I/O量（100万リクエスト単位）
  useReservedInstance: boolean = false,
  reservedInstanceType: keyof typeof PRICING.RESERVED_INSTANCE = 'ONE_YEAR_PARTIAL_UPFRONT'
): Array<{io: number; standardCost: number; ioOptimizedCost: number}> {
  const dataPoints = [];
  
  // I/O量を10ポイントに分割
  const step = maxIO / 10;
  
  for (let io = 0; io <= maxIO; io += step) {
    const standardCost = calculateStandardMonthlyCost(
      instanceType, storageGB, io, useReservedInstance, reservedInstanceType
    );
    
    const ioOptimizedCost = calculateIoOptimizedMonthlyCost(
      instanceType, storageGB, useReservedInstance, reservedInstanceType
    );
    
    dataPoints.push({
      io,
      standardCost,
      ioOptimizedCost
    });
  }
  
  return dataPoints;
}

// ストレージサイズに対する料金比較データを生成
export function generateStorageComparisonData(
  instanceType: string,
  ioRequests: number,
  maxStorage: number = 1000, // 最大ストレージ（GB）
  useReservedInstance: boolean = false,
  reservedInstanceType: keyof typeof PRICING.RESERVED_INSTANCE = 'ONE_YEAR_PARTIAL_UPFRONT'
): Array<{storage: number; standardCost: number; ioOptimizedCost: number}> {
  const dataPoints = [];
  
  // ストレージサイズを10ポイントに分割
  const step = maxStorage / 10;
  
  for (let storage = 100; storage <= maxStorage; storage += step) {
    const standardCost = calculateStandardMonthlyCost(
      instanceType, storage, ioRequests, useReservedInstance, reservedInstanceType
    );
    
    const ioOptimizedCost = calculateIoOptimizedMonthlyCost(
      instanceType, storage, useReservedInstance, reservedInstanceType
    );
    
    dataPoints.push({
      storage,
      standardCost,
      ioOptimizedCost
    });
  }
  
  return dataPoints;
}

// ACU値からおおよそのインスタンスタイプを推定
export function estimateInstanceTypeFromACU(acu: number): string {
  if (acu <= 1) return 'db.t4g.medium';
  if (acu <= 2) return 'db.t4g.large';
  if (acu <= 4) return 'db.r6g.large';
  if (acu <= 8) return 'db.r6g.xlarge';
  if (acu <= 16) return 'db.r6g.2xlarge';
  if (acu <= 32) return 'db.r6g.4xlarge';
  if (acu <= 64) return 'db.r6g.8xlarge';
  if (acu <= 96) return 'db.r6g.12xlarge';
  return 'db.r6g.16xlarge';
}

// インスタンスタイプからおおよそのACU値を推定
export function estimateACUFromInstanceType(instanceType: string): number {
  switch(instanceType) {
    case 'db.t4g.medium': return 1;
    case 'db.t4g.large': return 2;
    case 'db.r6g.large': return 4;
    case 'db.r6g.xlarge': return 8;
    case 'db.r6g.2xlarge': return 16;
    case 'db.r6g.4xlarge': return 32;
    case 'db.r6g.8xlarge': return 64;
    case 'db.r6g.12xlarge': return 96;
    case 'db.r6g.16xlarge': return 128;
    case 'db.r5.large': return 4;
    case 'db.r5.xlarge': return 8;
    case 'db.r5.2xlarge': return 16;
    case 'db.r5.4xlarge': return 32;
    case 'db.r5.8xlarge': return 64;
    case 'db.r5.12xlarge': return 96;
    case 'db.r5.16xlarge': return 128;
    case 'db.r5.24xlarge': return 192;
    default: return 4;
  }
}
