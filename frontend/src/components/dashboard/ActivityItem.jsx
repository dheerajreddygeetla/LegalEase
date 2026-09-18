import { motion } from 'framer-motion';
import { FileText, MessageSquare, Clock } from 'lucide-react';
import { formatDateTime } from '../../utils/helpers';

const typeConfig = {
  document: { icon: FileText, color: '#D4A43A', bg: 'rgba(184,135,30,0.12)' },
  chat:     { icon: MessageSquare, color: '#6B8FD4', bg: 'rgba(107,143,212,0.12)' },
  default:  { icon: Clock, color: '#5A6280', bg: 'rgba(90,98,128,0.12)' },
};

const ActivityItem = ({ action, time, type, activity, index = 0 }) => {
  // Support both flat props (Dashboard) and nested activity object
  const _action = action ?? activity?.action;
  const _time   = time   ?? activity?.time;
  const _type   = type   ?? activity?.type;
  const config = typeConfig[_type] || typeConfig.default;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: 'easeOut' }}
      className="flex items-start gap-3 group"
      style={{ padding: '12px 0', position: 'relative' }}
    >
      {/* Timeline dot + line */}
      <div className="relative flex flex-col items-center flex-shrink-0" style={{ width: 32 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '10px',
            background: config.bg,
            border: `1px solid ${config.color}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'box-shadow 0.2s ease',
          }}
          className="group-hover:shadow-[0_0_12px_rgba(184,135,30,0.2)]"
        >
          <Icon style={{ width: 14, height: 14, color: config.color }} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-1">
        <p
          className="text-sm font-medium truncate leading-snug"
          style={{ color: 'var(--text-primary)' }}
        >
          {_action}
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          {formatDateTime(_time)}
        </p>
      </div>
    </motion.div>
  );
};

export default ActivityItem;
