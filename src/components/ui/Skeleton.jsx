export function Skeleton({ className = "" }) {
    return <div className={`skeleton ${className}`} />;
}

export function MovieCardSkeleton() {
    return (
        <div className="block">
            <div className="rounded-xl overflow-hidden">
                <Skeleton className="aspect-[2/3] w-full" />
            </div>
            <div className="mt-2 space-y-1.5 px-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
            </div>
        </div>
    );
}

export function DetailSkeleton() {
    return (
        <div className="animate-pulse">
            <Skeleton className="w-full h-[50vh]" />
            <div className="max-w-6xl mx-auto px-4 py-8 flex gap-8">
                <Skeleton className="w-48 h-72 rounded-xl shrink-0" />
                <div className="flex-1 space-y-4">
                    <Skeleton className="h-8 w-2/3" />
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </div>
        </div>
    );
}