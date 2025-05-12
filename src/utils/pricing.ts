// データベースエンジン一覧
export const ENGINES = {
  'mysql': 'Aurora MySQL',
  'postgresql': 'Aurora PostgreSQL'
};

// AWS リージョン一覧
export const REGIONS = {
  'us-east-1': 'US East (N. Virginia)',
  'us-east-2': 'US East (Ohio)',
  'us-west-1': 'US West (N. California)',
  'us-west-2': 'US West (Oregon)',
  'ap-northeast-1': 'Asia Pacific (Tokyo)',
  'ap-northeast-2': 'Asia Pacific (Seoul)',
  'ap-northeast-3': 'Asia Pacific (Osaka)',
  'ap-southeast-1': 'Asia Pacific (Singapore)',
  'ap-southeast-2': 'Asia Pacific (Sydney)',
  'ap-south-1': 'Asia Pacific (Mumbai)',
  'eu-central-1': 'Europe (Frankfurt)',
  'eu-west-1': 'Europe (Ireland)',
  'eu-west-2': 'Europe (London)',
  'eu-west-3': 'Europe (Paris)',
  'sa-east-1': 'South America (São Paulo)'
};

// リージョンごとのインスタンス料金乗数
// 基準は us-east-1 で、それに対する相対料金
const REGION_MULTIPLIERS = {
  'us-east-1': 1.0,     // US East (N. Virginia)
  'us-east-2': 1.0,     // US East (Ohio)
  'us-west-1': 1.18,    // US West (N. California)
  'us-west-2': 1.0,     // US West (Oregon)
  'ap-northeast-1': 1.25, // Asia Pacific (Tokyo)
  'ap-northeast-2': 1.25, // Asia Pacific (Seoul)
  'ap-northeast-3': 1.25, // Asia Pacific (Osaka)
  'ap-southeast-1': 1.25, // Asia Pacific (Singapore)
  'ap-southeast-2': 1.25, // Asia Pacific (Sydney)
  'ap-south-1': 1.18,    // Asia Pacific (Mumbai)
  'eu-central-1': 1.15,  // Europe (Frankfurt)
  'eu-west-1': 1.05,    // Europe (Ireland)
  'eu-west-2': 1.15,    // Europe (London)
  'eu-west-3': 1.15,    // Europe (Paris)
  'sa-east-1': 1.4      // South America (São Paulo)
};

// リージョンごとのストレージ料金乗数
const STORAGE_MULTIPLIERS = {
  'us-east-1': 1.0,
  'us-east-2': 1.0,
  'us-west-1': 1.1,
  'us-west-2': 1.0,
  'ap-northeast-1': 1.15,
  'ap-northeast-2': 1.15,
  'ap-northeast-3': 1.15,
  'ap-southeast-1': 1.15,
  'ap-southeast-2': 1.15,
  'ap-south-1': 1.15,
  'eu-central-1': 1.1,
  'eu-west-1': 1.05,
  'eu-west-2': 1.1,
  'eu-west-3': 1.1,
  'sa-east-1': 1.3
};

// Aurora料金設定（基本は米国東部（バージニア北部）リージョン）
export const BASE_PRICING = {
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

// エンジンタイプに応じたインスタンスタイプを取得する
export function getInstanceTypes(engine: 'mysql' | 'postgresql'): string[] {
  try {
    // エンジンに応じたインスタンスタイプを取得
    const instanceTypeData = require('../data/instance-types.json');
    
    if (engine === 'mysql') {
      // MySQLのインスタンスタイプを取得
      const mysqlInstanceTypes = instanceTypeData.mysql;
      // すべてのインスタンスタイプを平坦化して返す
      return Object.values(mysqlInstanceTypes).flat() as string[];
    } else {
      // PostgreSQLのインスタンスタイプを取得
      const postgresqlInstanceTypes = instanceTypeData.postgresql;
      // すべてのインスタンスタイプを平坦化して返す
      return Object.values(postgresqlInstanceTypes).flat() as string[];
    }
  } catch (error) {
    console.error(`インスタンスタイプの読み込みエラー: ${error}`);
    // エラーの場合はプレースホルダーとして基本インスタンスを返す
    return Object.keys(BASE_PRICING.STANDARD.INSTANCE_PRICING);
  }
}

// インスタンスタイプ一覧（この行は下位互換性のために残します）
export const INSTANCE_TYPES = Object.keys(BASE_PRICING.STANDARD.INSTANCE_PRICING);

// エンジンタイプに応じた料金データをインポート
export function getPricingData(engine: 'mysql' | 'postgresql') {
  try {
    // 動的なインポートは難しいので、エンジンに応じて直接インポートする
    if (engine === 'mysql') {
      // MySQLの料金データを取得
      const mysqlPricing = require('../data/pricing-mysql.json');
      return mysqlPricing;
    } else {
      // PostgreSQLの料金データを取得
      const postgresqlPricing = require('../data/pricing-postgresql.json');
      return postgresqlPricing;
    }
  } catch (error) {
    console.error(`料金データの読み込みエラー: ${error}`);
    return BASE_PRICING; // フォールバックとして基本料金を返す
  }
}

// 指定されたリージョンの料金を取得
export function getPricingForRegion(region: string = 'us-east-1', engine: 'mysql' | 'postgresql' = 'mysql') {
  const regionMultiplier = REGION_MULTIPLIERS[region as keyof typeof REGION_MULTIPLIERS] || 1.0;
  const storageMultiplier = STORAGE_MULTIPLIERS[region as keyof typeof STORAGE_MULTIPLIERS] || 1.0;
  
  // エンジンに応じた料金データを取得
  const basePricing = getPricingData(engine);
  
  // 基本料金をディープコピー
  const regionalPricing = JSON.parse(JSON.stringify(basePricing));
  
  // インスタンス料金をリージョンに合わせて調整
  for (const instanceType in regionalPricing.STANDARD.INSTANCE_PRICING) {
    regionalPricing.STANDARD.INSTANCE_PRICING[instanceType] *= regionMultiplier;
    regionalPricing.IO_OPTIMIZED.INSTANCE_PRICING[instanceType] *= regionMultiplier;
  }
  
  // ストレージ関連の料金をリージョンに合わせて調整
  regionalPricing.STANDARD.STORAGE_PRICING *= storageMultiplier;
  regionalPricing.IO_OPTIMIZED.STORAGE_PRICING *= storageMultiplier;
  regionalPricing.SERVERLESS_V2.STORAGE_PRICING *= storageMultiplier;
  regionalPricing.STANDARD.BACKUP_PRICING *= storageMultiplier;
  regionalPricing.IO_OPTIMIZED.BACKUP_PRICING *= storageMultiplier;
  regionalPricing.SERVERLESS_V2.BACKUP_PRICING *= storageMultiplier;
  
  // I/O料金も調整
  regionalPricing.STANDARD.IO_PRICING *= regionMultiplier;
  
  // ACU料金の調整
  regionalPricing.SERVERLESS_V2.ACU_PRICING *= regionMultiplier;
  
  return regionalPricing;
}

// 月間コスト計算 - Aurora Standard
export function calculateStandardMonthlyCost(
  instanceType: string,
  storageGB: number,
  ioRequests: number, // 百万単位
  useReservedInstance: boolean = false,
  reservedInstanceType: keyof typeof BASE_PRICING.RESERVED_INSTANCE = 'ONE_YEAR_PARTIAL_UPFRONT',
  region: string = 'us-east-1',
  engine: 'mysql' | 'postgresql' = 'mysql'
): number {
  const pricing = getPricingForRegion(region, engine);
  
  // インスタンス時間料金（USD/時間）
  let hourlyRate = pricing.STANDARD.INSTANCE_PRICING[instanceType as keyof typeof pricing.STANDARD.INSTANCE_PRICING] || 0;
  
  // リザーブドインスタンスの場合は割引を適用
  if (useReservedInstance) {
    const discount = pricing.RESERVED_INSTANCE[reservedInstanceType];
    hourlyRate = hourlyRate * (1 - discount);
  }
  
  // 月間インスタンスコスト（30日で計算）
  const instanceCost = hourlyRate * 24 * 30;
  
  // ストレージコスト
  const storageCost = storageGB * pricing.STANDARD.STORAGE_PRICING;
  
  // I/Oコスト
  const ioCost = ioRequests * pricing.STANDARD.IO_PRICING;
  
  // バックアップコスト（ストレージの25%と仮定）
  const backupCost = storageGB * 0.25 * pricing.STANDARD.BACKUP_PRICING;
  
  // 合計コスト
  return instanceCost + storageCost + ioCost + backupCost;
}

// 月間コスト計算 - Aurora I/O-Optimized
export function calculateIoOptimizedMonthlyCost(
  instanceType: string,
  storageGB: number,
  useReservedInstance: boolean = false,
  reservedInstanceType: keyof typeof BASE_PRICING.RESERVED_INSTANCE = 'ONE_YEAR_PARTIAL_UPFRONT',
  region: string = 'us-east-1',
  engine: 'mysql' | 'postgresql' = 'mysql'
): number {
  const pricing = getPricingForRegion(region, engine);
  
  // インスタンス時間料金（USD/時間）
  let hourlyRate = pricing.IO_OPTIMIZED.INSTANCE_PRICING[instanceType as keyof typeof pricing.IO_OPTIMIZED.INSTANCE_PRICING] || 0;
  
  // リザーブドインスタンスの場合は割引を適用
  if (useReservedInstance) {
    const discount = pricing.RESERVED_INSTANCE[reservedInstanceType];
    hourlyRate = hourlyRate * (1 - discount);
  }
  
  // 月間インスタンスコスト（30日で計算）
  const instanceCost = hourlyRate * 24 * 30;
  
  // ストレージコスト
  const storageCost = storageGB * pricing.IO_OPTIMIZED.STORAGE_PRICING;
  
  // バックアップコスト（ストレージの25%と仮定）
  const backupCost = storageGB * 0.25 * pricing.IO_OPTIMIZED.BACKUP_PRICING;
  
  // 合計コスト（I/O-Optimizedの場合はI/Oコストなし）
  return instanceCost + storageCost + backupCost;
}

// 月間コスト計算 - Aurora Serverless v2
export function calculateServerlessV2MonthlyCost(
  averageACU: number, // 平均ACU使用量
  storageGB: number,
  region: string = 'us-east-1',
  engine: 'mysql' | 'postgresql' = 'mysql'
): number {
  const pricing = getPricingForRegion(region, engine);
  
  // ACUコスト
  const acuCost = averageACU * pricing.SERVERLESS_V2.ACU_PRICING * 24 * 30;
  
  // ストレージコスト
  const storageCost = storageGB * pricing.SERVERLESS_V2.STORAGE_PRICING;
  
  // バックアップコスト（ストレージの25%と仮定）
  const backupCost = storageGB * 0.25 * pricing.SERVERLESS_V2.BACKUP_PRICING;
  
  // 合計コスト
  return acuCost + storageCost + backupCost;
}

// 最適なAuroraタイプを決定
export function determineOptimalAuroraType(
  instanceType: string,
  storageGB: number,
  ioRequests: number, // 百万単位
  useReservedInstance: boolean = false,
  reservedInstanceType: keyof typeof BASE_PRICING.RESERVED_INSTANCE = 'ONE_YEAR_PARTIAL_UPFRONT',
  region: string = 'us-east-1',
  engine: 'mysql' | 'postgresql' = 'mysql'
): {
  recommendedType: string;
  standardCost: number;
  ioOptimizedCost: number;
  savingsAmount: number;
  savingsPercentage: number;
} {
  // 各タイプのコスト計算
  const standardCost = calculateStandardMonthlyCost(
    instanceType, storageGB, ioRequests, useReservedInstance, reservedInstanceType, region, engine
  );
  
  const ioOptimizedCost = calculateIoOptimizedMonthlyCost(
    instanceType, storageGB, useReservedInstance, reservedInstanceType, region, engine
  );
  
  // 差額計算
  const savingsAmount = Math.abs(standardCost - ioOptimizedCost);
  const savingsPercentage = (savingsAmount / Math.max(standardCost, ioOptimizedCost)) * 100;
  
  // 最適なタイプを判断
  const recommendedType = standardCost < ioOptimizedCost ? 'Standard' : 'I/O-Optimized';
  
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
  reservedInstanceType: keyof typeof BASE_PRICING.RESERVED_INSTANCE = 'ONE_YEAR_PARTIAL_UPFRONT',
  region: string = 'us-east-1',
  engine: 'mysql' | 'postgresql' = 'mysql'
): number {
  const pricing = getPricingForRegion(region, engine);
  
  // インスタンス料金（リザーブドインスタンス割引適用済み）
  let standardHourlyRate = pricing.STANDARD.INSTANCE_PRICING[instanceType as keyof typeof pricing.STANDARD.INSTANCE_PRICING] || 0;
  let ioOptimizedHourlyRate = pricing.IO_OPTIMIZED.INSTANCE_PRICING[instanceType as keyof typeof pricing.IO_OPTIMIZED.INSTANCE_PRICING] || 0;
  
  if (useReservedInstance) {
    const discount = pricing.RESERVED_INSTANCE[reservedInstanceType];
    standardHourlyRate = standardHourlyRate * (1 - discount);
    ioOptimizedHourlyRate = ioOptimizedHourlyRate * (1 - discount);
  }
  
  // 月間固定コスト（インスタンス + ストレージ + バックアップ）
  const standardFixedCost = (standardHourlyRate * 24 * 30) + 
                           (storageGB * pricing.STANDARD.STORAGE_PRICING) + 
                           (storageGB * 0.25 * pricing.STANDARD.BACKUP_PRICING);
  
  const ioOptimizedFixedCost = (ioOptimizedHourlyRate * 24 * 30) + 
                              (storageGB * pricing.IO_OPTIMIZED.STORAGE_PRICING) + 
                              (storageGB * 0.25 * pricing.IO_OPTIMIZED.BACKUP_PRICING);
  
  // I/O-Optimizedの固定コストが高い場合、損益分岐点を計算
  if (ioOptimizedFixedCost > standardFixedCost) {
    // I/O-OptimizedとStandardが等しくなるI/O量を計算
    // ioOptimizedFixedCost = standardFixedCost + (io * IO_PRICING)
    // 解いて: io = (ioOptimizedFixedCost - standardFixedCost) / IO_PRICING
    return (ioOptimizedFixedCost - standardFixedCost) / pricing.STANDARD.IO_PRICING;
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
  reservedInstanceType: keyof typeof BASE_PRICING.RESERVED_INSTANCE = 'ONE_YEAR_PARTIAL_UPFRONT',
  region: string = 'us-east-1',
  engine: 'mysql' | 'postgresql' = 'mysql'
): Array<{io: number; standardCost: number; ioOptimizedCost: number}> {
  const dataPoints = [];
  
  // I/O量を10ポイントに分割
  const step = maxIO / 10;
  
  for (let io = 0; io <= maxIO; io += step) {
    const standardCost = calculateStandardMonthlyCost(
      instanceType, storageGB, io, useReservedInstance, reservedInstanceType, region, engine
    );
    
    const ioOptimizedCost = calculateIoOptimizedMonthlyCost(
      instanceType, storageGB, useReservedInstance, reservedInstanceType, region, engine
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
  reservedInstanceType: keyof typeof BASE_PRICING.RESERVED_INSTANCE = 'ONE_YEAR_PARTIAL_UPFRONT',
  region: string = 'us-east-1',
  engine: 'mysql' | 'postgresql' = 'mysql'
): Array<{storage: number; standardCost: number; ioOptimizedCost: number}> {
  const dataPoints = [];
  
  // ストレージサイズを10ポイントに分割
  const step = maxStorage / 10;
  
  for (let storage = 100; storage <= maxStorage; storage += step) {
    const standardCost = calculateStandardMonthlyCost(
      instanceType, storage, ioRequests, useReservedInstance, reservedInstanceType, region, engine
    );
    
    const ioOptimizedCost = calculateIoOptimizedMonthlyCost(
      instanceType, storage, useReservedInstance, reservedInstanceType, region, engine
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