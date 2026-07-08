import { motion } from 'framer-motion';

// Base Skeleton Component with shimmer animation
const SkeletonLoader = ({
  width = '100%',
  height = '1rem',
  className = '',
  borderRadius = '0.25rem'
}) => {
  return (
    <motion.div
      className={`bg-light ${className}`}
      style={{
        width,
        height,
        borderRadius,
        overflow: 'hidden'
      }}
      initial={{ opacity: 0.5 }}
      animate={{
        opacity: [0.5, 1, 0.5],
        background: [
          'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
          'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)'
        ]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  );
};

// Skeleton for Stat Cards (used in dashboards)
export const SkeletonStatCard = () => (
  <motion.div
    className="stat-card d-flex align-items-center p-3"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="stat-icon me-3">
      <SkeletonLoader width="40px" height="40px" borderRadius="50%" />
    </div>
    <div className="stat-content flex-grow-1">
      <SkeletonLoader width="60%" height="1.5rem" className="mb-1" />
      <SkeletonLoader width="40%" height="1rem" />
    </div>
  </motion.div>
);

// Skeleton for Dashboard Cards (larger content containers)
export const SkeletonDashboardCard = () => (
  <motion.div
    className="dashboard-card p-4"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <SkeletonLoader width="70%" height="1.75rem" className="mb-3" />
    <SkeletonLoader width="100%" height="1rem" className="mb-2" />
    <SkeletonLoader width="90%" height="1rem" className="mb-2" />
    <SkeletonLoader width="50%" height="1rem" className="mb-3" />
    <div className="d-flex gap-2">
      <SkeletonLoader width="80px" height="32px" borderRadius="0.375rem" />
      <SkeletonLoader width="100px" height="32px" borderRadius="0.375rem" />
    </div>
  </motion.div>
);

// Skeleton for Table Rows (used in admin tables)
export const SkeletonTableRow = ({ columns = 6 }) => (
  <motion.tr
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    {Array.from({ length: columns }, (_, i) => (
      <td key={i} className="p-3">
        <SkeletonLoader
          width={i === 0 ? '80%' : i === columns - 1 ? '120px' : '60%'}
          height="1rem"
        />
      </td>
    ))}
  </motion.tr>
);

// Skeleton for List Items (events, groups, users)
export const SkeletonListItem = () => (
  <motion.div
    className="event-item d-flex align-items-center p-3 mb-2"
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex-grow-1">
      <SkeletonLoader width="70%" height="1.25rem" className="mb-1" />
      <SkeletonLoader width="50%" height="0.875rem" />
    </div>
    <div className="d-flex gap-2">
      <SkeletonLoader width="60px" height="24px" borderRadius="1rem" />
      <SkeletonLoader width="80px" height="24px" borderRadius="1rem" />
    </div>
  </motion.div>
);

// Skeleton for Form Fields
export const SkeletonFormField = () => (
  <motion.div
    className="mb-3"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <SkeletonLoader width="30%" height="1rem" className="mb-2" />
    <SkeletonLoader width="100%" height="2.5rem" borderRadius="0.375rem" />
  </motion.div>
);

// Skeleton for Profile Sections
export const SkeletonProfile = () => (
  <motion.div
    className="main container"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <SkeletonLoader width="50%" height="2rem" className="mb-4 mx-auto" />
    <div className="text-center mb-4">
      <SkeletonLoader
        width="120px"
        height="120px"
        borderRadius="50%"
        className="mx-auto d-block"
      />
    </div>
    <SkeletonFormField />
    <SkeletonFormField />
    <SkeletonFormField />
    <div className="d-flex gap-2 justify-content-center">
      <SkeletonLoader width="100px" height="38px" borderRadius="0.375rem" />
      <SkeletonLoader width="120px" height="38px" borderRadius="0.375rem" />
    </div>
  </motion.div>
);

// Skeleton for Feature Cards (home page grid)
export const SkeletonFeatureCard = () => (
  <motion.div
    className="feature-card p-4 text-center"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="feature-icon mb-3">
      <SkeletonLoader width="60px" height="60px" borderRadius="50%" className="mx-auto" />
    </div>
    <SkeletonLoader width="80%" height="1.5rem" className="mb-2 mx-auto" />
    <SkeletonLoader width="100%" height="1rem" className="mb-1" />
    <SkeletonLoader width="90%" height="1rem" />
  </motion.div>
);

// Skeleton for Dashboard Grid (multiple stat cards)
export const SkeletonDashboardGrid = ({ count = 4 }) => (
  <motion.div
    className="row g-3"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="col-md-3">
        <SkeletonStatCard />
      </div>
    ))}
  </motion.div>
);

// Skeleton for Table (full table with headers and rows)
export const SkeletonTable = ({ rows = 5, columns = 6 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            {Array.from({ length: columns }, (_, i) => (
              <th key={i} className="p-3">
                <SkeletonLoader width="60%" height="1rem" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, i) => (
            <SkeletonTableRow key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

export default SkeletonLoader;<parameter/>