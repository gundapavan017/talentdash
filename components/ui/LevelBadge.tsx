import { Level } from '@/types';
import { LEVEL_COLORS } from '@/lib/constants';

export default function LevelBadge({ level }: { level: Level }) {
  const cls = LEVEL_COLORS[level] ?? 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${cls}`}>
      {level}
    </span>
  );
}
