interface PoolDistributionProps {
  yesPercentage: number;
  noPercentage: number;
  yesPool: number;
  noPool: number;
  yesStakers: number;
  noStakers: number;
}

export default function PoolDistribution({
  yesPercentage,
  noPercentage,
  yesPool,
  noPool,
  yesStakers,
  noStakers,
}: PoolDistributionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">Prediction Distribution</h4>
        <span className="text-xs text-gray-500">
          Based on predictor stakes only
        </span>
      </div>
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-green-600">YES ({yesPercentage || 0}%)</span>
          <span className="text-green-600">
            ${(yesPool || 0).toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${yesPercentage || 0}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{yesStakers || 0} stakers</p>
      </div>
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-red-600">NO ({noPercentage || 0}%)</span>
          <span className="text-red-600">
            ${(noPool || 0).toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-red-500 h-2 rounded-full"
            style={{ width: `${noPercentage || 0}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{noStakers || 0} stakers</p>
      </div>
    </div>
  );
}




