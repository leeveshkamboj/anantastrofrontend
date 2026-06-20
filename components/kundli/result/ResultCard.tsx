import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { serviceFormCardClassName } from '@/components/services';
import { cn } from '@/lib/utils';

export function ResultCard({ className, ...props }: React.ComponentProps<typeof Card>) {
  return <Card className={cn(serviceFormCardClassName, className)} {...props} />;
}

export { CardContent, CardHeader, CardTitle };
