import { SecurityFeaturesProps } from '@/lib/types';
import { cn } from '@/lib/utils';

export function SecurityFeatures({ className }: SecurityFeaturesProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center", className)}>
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <div className="text-green-600 mb-2">🔒</div>
        <h4 className="font-semibold text-gray-800 mb-1">Client-Side Processing</h4>
        <p className="text-gray-600 text-sm">Images processed in your browser, never uploaded to unknown servers</p>
      </div>
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="text-blue-600 mb-2">🔑</div>
        <h4 className="font-semibold text-gray-800 mb-1">Your API Keys</h4>
        <p className="text-gray-600 text-sm">Uses your personal tokens, you control access and costs</p>
      </div>
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <div className="text-purple-600 mb-2">🚫</div>
        <h4 className="font-semibold text-gray-800 mb-1">No Data Storage</h4>
        <p className="text-gray-600 text-sm">Images and prompts aren't saved or logged by the app</p>
      </div>
    </div>
  );
}