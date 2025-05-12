import React, { useState, useEffect } from 'react';
import { REGIONS, ENGINES, getInstanceTypes } from '../utils/pricing';

interface InputFormProps {
  onSubmit: (formData: FormData) => void;
  isLoading?: boolean;
}

export interface FormData {
  engine: 'mysql' | 'postgresql';
  instanceType: string;
  storageGB: number;
  ioRequests: number;
  useReservedInstance: boolean;
  reservedInstanceType: string;
  useServerlessV2: boolean;
  averageACU: number;
  showCurrentUsage: boolean;
  region: string;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState<FormData>({
    engine: 'mysql',
    instanceType: 'db.r6g.xlarge',
    storageGB: 500,
    ioRequests: 50,
    useReservedInstance: false,
    reservedInstanceType: 'ONE_YEAR_PARTIAL_UPFRONT',
    useServerlessV2: false,
    averageACU: 8,
    showCurrentUsage: false,
    region: 'ap-northeast-1',
  });

  // エンジンタイプに応じたインスタンスタイプのリスト
  const [availableInstanceTypes, setAvailableInstanceTypes] = useState<string[]>([]);

  // エンジンが変更されたときにインスタンスタイプのリストを更新
  useEffect(() => {
    // エンジンに応じたインスタンスタイプのリストを取得
    const instanceTypes = getInstanceTypes(formData.engine);
    setAvailableInstanceTypes(instanceTypes as string[]);

    // 現在選択されているインスタンスタイプが新しいリストに含まれているか確認
    const isCurrentInstanceTypeValid = instanceTypes.includes(formData.instanceType);
    
    // 含まれていない場合は、リストの最初のインスタンスタイプを選択
    if (!isCurrentInstanceTypeValid && instanceTypes.length > 0) {
      setFormData(prev => ({
        ...prev,
        instanceType: instanceTypes[0]
      }));
    }
  }, [formData.engine]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? Number(value) : 
              value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Serverless V2とプロビジョンドインスタンスの切り替え時に関連フィールドをリセット
  useEffect(() => {
    if (formData.useServerlessV2) {
      // Aurora Serverless V2に切り替えたらリザーブドインスタンスの選択を解除
      setFormData(prev => ({
        ...prev,
        useReservedInstance: false
      }));
    }
  }, [formData.useServerlessV2]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Aurora 設定</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 左カラム - 基本設定 */}
        <div className="space-y-4">
          <div>
            <label htmlFor="region" className="block text-sm font-medium mb-1">
              リージョン
            </label>
            <select
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={isLoading}
            >
              {Object.entries(REGIONS).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="engine" className="block text-sm font-medium mb-1">
              データベースエンジン
            </label>
            <select
              id="engine"
              name="engine"
              value={formData.engine}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={isLoading}
            >
              {Object.entries(ENGINES).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="useServerlessV2"
              name="useServerlessV2"
              checked={formData.useServerlessV2}
              onChange={handleChange}
              className="mr-2 h-4 w-4"
            />
            <label htmlFor="useServerlessV2" className="text-sm font-medium">
              Aurora Serverless v2を使用
            </label>
          </div>

          {!formData.useServerlessV2 ? (
            // プロビジョンドインスタンスの場合
            <>
              <div>
                <label htmlFor="instanceType" className="block text-sm font-medium mb-1">
                  インスタンスタイプ
                </label>
                <select
                  id="instanceType"
                  name="instanceType"
                  value={formData.instanceType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled={isLoading}
                >
                  {availableInstanceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="useReservedInstance"
                  name="useReservedInstance"
                  checked={formData.useReservedInstance}
                  onChange={handleChange}
                  className="mr-2 h-4 w-4"
                  disabled={isLoading}
                />
                <label htmlFor="useReservedInstance" className="text-sm font-medium">
                  リザーブドインスタンスを使用
                </label>
              </div>

              {formData.useReservedInstance && (
                <div>
                  <label htmlFor="reservedInstanceType" className="block text-sm font-medium mb-1">
                    リザーブドインスタンスタイプ
                  </label>
                  <select
                    id="reservedInstanceType"
                    name="reservedInstanceType"
                    value={formData.reservedInstanceType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    disabled={isLoading}
                  >
                    <option value="ONE_YEAR_PARTIAL_UPFRONT">1年間 - 一部前払い (40%割引)</option>
                    <option value="THREE_YEAR_PARTIAL_UPFRONT">3年間 - 一部前払い (60%割引)</option>
                    <option value="ONE_YEAR_ALL_UPFRONT">1年間 - 全額前払い (45%割引)</option>
                    <option value="THREE_YEAR_ALL_UPFRONT">3年間 - 全額前払い (65%割引)</option>
                  </select>
                </div>
              )}
            </>
          ) : (
            // Aurora Serverless v2の場合
            <div>
              <label htmlFor="averageACU" className="block text-sm font-medium mb-1">
                平均ACU使用量
              </label>
              <input
                type="number"
                id="averageACU"
                name="averageACU"
                value={formData.averageACU}
                onChange={handleChange}
                min="0.5"
                max="256"
                step="0.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                0.5 ACUから256 ACUの間で指定してください
              </p>
            </div>
          )}
        </div>

        {/* 右カラム - ストレージとI/O設定 */}
        <div className="space-y-4">
          <div>
            <label htmlFor="storageGB" className="block text-sm font-medium mb-1">
              ストレージサイズ (GB)
            </label>
            <input
              type="number"
              id="storageGB"
              name="storageGB"
              value={formData.storageGB}
              onChange={handleChange}
              min="10"
              step="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="ioRequests" className="block text-sm font-medium mb-1">
              月間I/Oリクエスト数 (百万単位)
            </label>
            <input
              type="number"
              id="ioRequests"
              name="ioRequests"
              value={formData.ioRequests}
              onChange={handleChange}
              min="0"
              step="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={isLoading || formData.useServerlessV2}
            />
            {formData.useServerlessV2 && (
              <p className="text-xs text-gray-500 mt-1">
                Aurora Serverless v2ではI/Oリクエスト数の指定は不要です
              </p>
            )}
          </div>

          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              id="showCurrentUsage"
              name="showCurrentUsage"
              checked={formData.showCurrentUsage}
              onChange={handleChange}
              className="mr-2 h-4 w-4"
              disabled={isLoading}
            />
            <label htmlFor="showCurrentUsage" className="text-sm font-medium">
              現在の使用状況に基づく推奨事項を表示
            </label>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-amazon-orange text-white font-medium rounded-md hover:bg-opacity-90 transition-colors w-full"
          disabled={isLoading}
        >
          {isLoading ? '計算中...' : '計算する'}
        </button>
      </div>
    </form>
  );
};

export default InputForm;