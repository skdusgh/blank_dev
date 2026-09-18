import React, { useState } from 'react';
import { Zap, X, AlertTriangle, CheckCircle2, RotateCw, Activity } from 'lucide-react';

interface ChaosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyChaos: (type: string) => void;
}

export const ChaosModal: React.FC<ChaosModalProps> = ({
  isOpen,
  onClose,
  onApplyChaos,
}) => {
  const [selectedChaos, setSelectedChaos] = useState<string>('traffic-surge');
  const [isInjecting, setIsInjecting] = useState<boolean>(false);
  const [chaosLog, setChaosLog] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInject = () => {
    setIsInjecting(true);
    setChaosLog('Chaos Mesh Agent: 파드 네트워크 및 커넥션 스파이크 주입 중...');
    setTimeout(() => {
      setIsInjecting(false);
      if (selectedChaos === 'traffic-surge') {
        setChaosLog('✓ 트래픽 급증 주입 완료: QPS 420 -> 1,850 QPS, DB CPU 98% 도달');
      } else if (selectedChaos === 'packet-drop') {
        setChaosLog('✓ 패킷 유실 주입 완료: 15% Packet Loss 시뮬레이션 활성');
      } else {
        setChaosLog('✓ 핫픽스 롤백/복구 주입: 모든 인스턴스 정상 상태 회귀');
      }
      onApplyChaos(selectedChaos);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4">
      <div className="bg-[#172334] border border-[#253346] rounded-xl max-w-lg w-full p-4 sm:p-5 shadow-2xl space-y-4 text-slate-200 max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#253346]">
          <div className="flex items-center gap-2 text-[#0078ff]">
            <Zap className="w-5 h-5 text-red-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              Interactive Chaos Sandbox Event
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#203046] text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          실제 쿠버네티스 파드 환경에 카오스 엔지니어링 이벤트를 주입하여 시스템
          지표와 텔레메트리 그래프의 실시간 반응을 검증합니다.
        </p>

        {/* Chaos Options */}
        <div className="space-y-2">
          <label
            onClick={() => setSelectedChaos('traffic-surge')}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all min-h-[44px] ${
              selectedChaos === 'traffic-surge'
                ? 'bg-[#111a26] border-[#0078ff] ring-1 ring-[#0078ff]/30'
                : 'bg-[#111a26] border-[#253346] hover:border-slate-500'
            }`}
          >
            <input
              type="radio"
              name="chaos"
              checked={selectedChaos === 'traffic-surge'}
              onChange={() => setSelectedChaos('traffic-surge')}
              className="mt-1 accent-[#0078ff]"
            />
            <div>
              <div className="text-xs font-bold text-white">
                1. 대규모 사용자 트래픽 급증 (Traffic Surge)
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                동시 활성 쿼리 수 37개 -&gt; 120개 증가, DB Connection Pool 한계치 도달.
              </div>
            </div>
          </label>

          <label
            onClick={() => setSelectedChaos('packet-drop')}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all min-h-[44px] ${
              selectedChaos === 'packet-drop'
                ? 'bg-[#111a26] border-[#0078ff] ring-1 ring-[#0078ff]/30'
                : 'bg-[#111a26] border-[#253346] hover:border-slate-500'
            }`}
          >
            <input
              type="radio"
              name="chaos"
              checked={selectedChaos === 'packet-drop'}
              onChange={() => setSelectedChaos('packet-drop')}
              className="mt-1 accent-[#0078ff]"
            />
            <div>
              <div className="text-xs font-bold text-white">
                2. DB 프록시 간헐적 패킷 지연 (Latency Spike)
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                네트워크 RTT +400ms 지연 주입으로 클라이언트 타임아웃 캐스케이딩 유발.
              </div>
            </div>
          </label>

          <label
            onClick={() => setSelectedChaos('heal-patch')}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all min-h-[44px] ${
              selectedChaos === 'heal-patch'
                ? 'bg-[#111a26] border-[#00ba7c] ring-1 ring-[#00ba7c]/30'
                : 'bg-[#111a26] border-[#253346] hover:border-slate-500'
            }`}
          >
            <input
              type="radio"
              name="chaos"
              checked={selectedChaos === 'heal-patch'}
              onChange={() => setSelectedChaos('heal-patch')}
              className="mt-1 accent-[#00ba7c]"
            />
            <div>
              <div className="text-xs font-bold text-[#00ba7c]">
                3. 긴급 핫픽스 릴리즈 & 정상 복구 (Hotfix Apply)
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                TRIM 함수를 제거한 패치 쿼리를 즉시 적용하여 DB CPU를 14%로 안정화.
              </div>
            </div>
          </label>
        </div>

        {/* Live log output */}
        {chaosLog && (
          <div className="p-2.5 rounded-lg bg-[#111a26] border border-[#253346] font-mono text-[11px] text-[#00ba7c]">
            {chaosLog}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-[#253346]">
          <button
            onClick={onClose}
            className="px-3 py-2 sm:py-1.5 rounded-lg border border-[#253346] text-xs text-slate-400 hover:text-white hover:bg-[#203046] min-h-[40px] sm:min-h-0"
          >
            닫기
          </button>
          <button
            onClick={handleInject}
            disabled={isInjecting}
            className="px-4 py-2 sm:py-1.5 rounded-lg bg-[#0078ff] text-white text-xs font-bold hover:bg-[#0064d6] transition-all flex items-center gap-1.5 active:scale-95 min-h-[40px] sm:min-h-0 shadow-md"
          >
            {isInjecting ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>주입 중...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>이벤트 즉시 트리거</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
