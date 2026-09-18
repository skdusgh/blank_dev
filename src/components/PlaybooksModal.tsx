import React, { useState } from 'react';
import { BookOpen, X, ChevronRight, CheckCircle2, AlertTriangle, ShieldCheck, Terminal, Database } from 'lucide-react';

interface PlaybooksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlaybooksModal: React.FC<PlaybooksModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<string>('db-index');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-[#172334] border border-[#253346] rounded-xl max-w-3xl w-full h-[80vh] flex flex-col shadow-2xl text-slate-200 overflow-hidden">
        {/* Header */}
        <div className="h-12 px-5 border-b border-[#253346] flex items-center justify-between bg-[#111a26] shrink-0">
          <div className="flex items-center gap-2 text-[#0078ff]">
            <BookOpen className="w-4 h-4" />
            <h3 className="text-sm font-bold text-white">
              Blank_Dev SRE 트러블슈팅 핸드북 & 플레이북
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#203046] text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar / Mobile Tabs */}
          <aside className="w-full md:w-52 bg-[#111a26] border-b md:border-b-0 md:border-r border-[#253346] p-2 flex md:flex-col gap-1.5 text-xs select-none shrink-0 overflow-x-auto no-scrollbar whitespace-nowrap">
            <button
              onClick={() => setActiveTab('db-index')}
              className={`px-3 py-2 md:p-2.5 rounded-lg text-left transition-colors shrink-0 active:scale-95 ${
                activeTab === 'db-index'
                  ? 'bg-[#172334] text-[#0078ff] font-bold border-b-2 md:border-b-0 md:border-l-2 border-[#0078ff]'
                  : 'text-slate-400 hover:text-white hover:bg-[#172334]'
              }`}
            >
              01. 인덱스 왜곡 & 쿼리
            </button>
            <button
              onClick={() => setActiveTab('null-pointer')}
              className={`px-3 py-2 md:p-2.5 rounded-lg text-left transition-colors shrink-0 active:scale-95 ${
                activeTab === 'null-pointer'
                  ? 'bg-[#172334] text-[#0078ff] font-bold border-b-2 md:border-b-0 md:border-l-2 border-[#0078ff]'
                  : 'text-slate-400 hover:text-white hover:bg-[#172334]'
              }`}
            >
              02. NullPointer 방어
            </button>
            <button
              onClick={() => setActiveTab('connection-pool')}
              className={`px-3 py-2 md:p-2.5 rounded-lg text-left transition-colors shrink-0 active:scale-95 ${
                activeTab === 'connection-pool'
                  ? 'bg-[#172334] text-[#0078ff] font-bold border-b-2 md:border-b-0 md:border-l-2 border-[#0078ff]'
                  : 'text-slate-400 hover:text-white hover:bg-[#172334]'
              }`}
            >
              03. 커넥션 풀 누수
            </button>
            <button
              onClick={() => setActiveTab('api-timeout')}
              className={`px-3 py-2 md:p-2.5 rounded-lg text-left transition-colors shrink-0 active:scale-95 ${
                activeTab === 'api-timeout'
                  ? 'bg-[#172334] text-[#0078ff] font-bold border-b-2 md:border-b-0 md:border-l-2 border-[#0078ff]'
                  : 'text-slate-400 hover:text-white hover:bg-[#172334]'
              }`}
            >
              04. 외부 API 타임아웃
            </button>
            <button
              onClick={() => setActiveTab('jvm-oom')}
              className={`px-3 py-2 md:p-2.5 rounded-lg text-left transition-colors shrink-0 active:scale-95 ${
                activeTab === 'jvm-oom'
                  ? 'bg-[#172334] text-[#0078ff] font-bold border-b-2 md:border-b-0 md:border-l-2 border-[#0078ff]'
                  : 'text-slate-400 hover:text-white hover:bg-[#172334]'
              }`}
            >
              05. JVM Heap OOM
            </button>
          </aside>

          {/* Content Pane */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-300">
            {activeTab === 'db-index' && (
              <>
                <div className="flex items-center gap-2 text-base font-bold text-white">
                  <Database className="w-5 h-5 text-[#0078ff]" />
                  <h4>인덱스 컬럼 좌변 가공 및 풀 테이블 스캔 트러블슈팅</h4>
                </div>
                <div className="p-3 bg-[#111a26] border border-[#253346] rounded-lg font-mono text-[11px] text-[#0078ff]">
                  Rule 1: WHERE 조건절 컬럼을 함수(TRIM, SUBSTR, TO_CHAR 등)로 감싸면 B-Tree 인덱스가 무력화됩니다.
                </div>
                <h5 className="font-bold text-white text-sm mt-3">증상 감지 흐름</h5>
                <ul className="list-disc pl-5 space-y-1 text-slate-400">
                  <li>평소 0.1~0.3s 이내이던 단일 조회 쿼리가 특정 배포 이후 9초 이상으로 지연.</li>
                  <li>RDS CPU 사용률이 90% 이상으로 치솟으며, 활성 연결 세션이 누적.</li>
                  <li><code>EXPLAIN ANALYZE</code> 실행 시 <code>TABLE ACCESS FULL</code> 또는 <code>type: ALL</code> 확인.</li>
                </ul>
                <h5 className="font-bold text-white text-sm mt-3">대응 및 조치</h5>
                <div className="bg-[#111a26] p-3 rounded-lg font-mono border border-[#253346]">
                  <span className="text-red-400">-- 취약한 쿼리</span>
                  <br />
                  SELECT * FROM tb_employees WHERE TRIM(emp_no) = '20261234';
                  <br />
                  <br />
                  <span className="text-[#00ba7c]">-- 최적화 튜닝 쿼리</span>
                  <br />
                  SELECT * FROM tb_employees WHERE emp_no = '20261234';
                </div>
              </>
            )}

            {activeTab === 'null-pointer' && (
              <>
                <div className="flex items-center gap-2 text-base font-bold text-white">
                  <Terminal className="w-5 h-5 text-amber-400" />
                  <h4>NullPointerException 간헐적 500 에러 방어 디버깅</h4>
                </div>
                <p className="text-slate-400">
                  Spring WAS 환경에서 결제 콜백, DTO 매핑 시 객체의 null 여부를 확인하지 않고
                  메서드를 체이닝 호출할 때 발생하는 런타임 예외입니다.
                </p>
                <div className="bg-[#111a26] p-3 rounded-lg font-mono border border-[#253346] text-slate-200">
                  <code>Optional.ofNullable(paymentDto.getCardInfo()).map(CardInfo::getToken).orElseThrow(...);</code>
                </div>
              </>
            )}

            {activeTab === 'connection-pool' && (
              <>
                <div className="flex items-center gap-2 text-base font-bold text-white">
                  <Database className="w-5 h-5 text-[#00ba7c]" />
                  <h4>HikariCP 커넥션 풀 고갈 및 Leak 점검</h4>
                </div>
                <p className="text-slate-400">
                  트랜잭션 내부에서 외부 API 호출을 동기로 수행하거나, 리소스 try-with-resources
                  누락으로 인해 반납되지 않은 커넥션이 누적될 때 발생합니다.
                </p>
              </>
            )}

            {activeTab === 'api-timeout' && (
              <>
                <div className="flex items-center gap-2 text-base font-bold text-white">
                  <AlertTriangle className="w-5 h-5 text-[#0078ff]" />
                  <h4>외부 API 타임아웃 및 재시도 폭증 방지</h4>
                </div>
                <p className="text-slate-400">
                  Connect Timeout (2초)과 Read Timeout (3초)을 명시하고, 서킷 브레이커(Resilience4j)를
                  적용하여 제휴사 장애가 전체 스레드 풀을 잠식하지 않도록 격리해야 합니다.
                </p>
              </>
            )}

            {activeTab === 'jvm-oom' && (
              <>
                <div className="flex items-center gap-2 text-base font-bold text-white">
                  <ShieldCheck className="w-5 h-5 text-purple-400" />
                  <h4>JVM OutOfMemoryError 및 대량 조회 청크 처리</h4>
                </div>
                <p className="text-slate-400">
                  정산 배치 시 전체 1,000만 건 데이터를 한 번에 메모리에 로드하는 <code>findAll()</code>
                  대신 Paging/Chunk 또는 JPA Cursor Stream을 사용하여 JVM 힙 고갈을 방지합니다.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#253346] flex justify-end bg-[#111a26]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#0078ff] text-white text-xs font-bold hover:bg-[#0064d6] shadow-md"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
