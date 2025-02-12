import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CustomerInterfaceSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="h-4 w-40 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-10 w-full animate-pulse rounded bg-muted" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-32 w-full animate-pulse rounded bg-muted" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-10 w-full animate-pulse rounded bg-muted" />
          </div>
          <div className="h-10 w-full animate-pulse rounded bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
}
