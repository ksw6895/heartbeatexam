interface AudioStackProps {
  audio: string[];
  hideLabels?: boolean;
}

export default function AudioStack({ audio, hideLabels = false }: AudioStackProps) {
  return (
    <div className="flex flex-col gap-2">
      {audio.map((src, index) => (
        <div key={src} className="flex flex-col gap-1">
          {!hideLabels && (
            <span className="text-xs font-medium text-slate-500">오디오 {index + 1}</span>
          )}
          <audio controls preload="none" className="w-full">
            <source src={src} type="audio/mpeg" />
            {`오디오 ${index + 1}를 재생할 수 없습니다.`}
          </audio>
        </div>
      ))}
    </div>
  );
}
