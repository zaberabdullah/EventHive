export default function EventCardSkeleton() {
  return (
    <div className="ticket-card h-full">
      <div className="skeleton h-44 w-full shrink-0" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="skeleton h-5 w-4/5 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
      </div>
      <div className="ticket-perforation flex items-center justify-between px-4 py-3">
        <div className="skeleton h-4 w-10 rounded" />
        <div className="skeleton h-5 w-14 rounded" />
        <div className="skeleton h-8 w-20 rounded-full" />
      </div>
    </div>
  );
}
